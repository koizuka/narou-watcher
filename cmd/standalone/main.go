package main

import (
	"bufio"
	"fmt"
	"log"
	"narou-watcher/narou"
	"os"
	"os/exec"
	"path"
	"strings"
	"time"

	"github.com/koizuka/scraper"
	"github.com/skratchdot/open-golang/open"
)

const (
	maxOpen          = 2                   // この数まで一度に最大でブラウザを開く
	durationToIgnore = 30 * 24 * time.Hour // 30日以上前の更新作品は無視する
)

type Prompter struct {
	reader *bufio.Reader
}

func (prompter *Prompter) prompt(prompt string) (string, error) {
	fmt.Printf("%s: ", prompt)
	if prompter.reader == nil {
		prompter.reader = bufio.NewReader(os.Stdin)
	}
	line, err := prompter.reader.ReadString('\n')
	// fmt.Println(line)
	if err == nil {
		line = strings.TrimSuffix(line, "\n")
		line = strings.TrimSuffix(line, "\r")
	}
	return line, err
}

type DurationUnit struct {
	Name string
	Unit time.Duration
}

func FormatDuration(d time.Duration) string {
	result := ""

	units := []DurationUnit{
		{"d", 24 * time.Hour},
		{"h", time.Hour},
		{"m", time.Minute},
	}

	for _, u := range units {
		if d >= u.Unit {
			result = result + fmt.Sprintf("%d%s", d/u.Unit, u.Name)
			d = d % u.Unit
		}
	}

	return result
}

func filterUpdates(from []narou.IsNoticeList) []narou.IsNoticeList {
	var result []narou.IsNoticeList
	for _, item := range from {
		if item.BookmarkEpisode == item.LatestEpisode {
			continue
		}
		if time.Since(item.UpdateTime) >= durationToIgnore {
			continue
		}
		result = append(result, item)
	}
	return result
}

func getProjectDirectory() string {
	out, err := exec.Command("git", "rev-parse", "--show-toplevel").Output()
	if err != nil {
		log.Fatalf("git failed: %v", err)
	}
	return strings.TrimSpace(string(out))
}

type SubCommand struct {
	command string
	parse   func(args []string) error
}

func ParseArgs(SubCommands []SubCommand) error {
	if len(os.Args) >= 2 {
		for _, cmd := range SubCommands {
			if os.Args[1] == cmd.command {
				return cmd.parse(os.Args[2:])
			}
		}
		_, _ = fmt.Fprintf(os.Stderr, "unknown subcommand: %v\n\n", os.Args[1])
		_, _ = fmt.Fprintln(os.Stderr, "Available commands:")
		for _, cmd := range SubCommands {
			_, _ = fmt.Fprintf(os.Stderr, "  %v\n", cmd.command)
		}

		os.Exit(1)
	}
	return nil
}

func main() {
	var logger scraper.ConsoleLogger

	projectDir := getProjectDirectory()
	logDir := path.Join(projectDir, "log")
	sessionName := "narou"
	//fmt.Printf("log directory: '%v/%v'\n", logDir, sessionName)

	dirName := path.Join(logDir, sessionName)
	if _, err := os.Stat(dirName); os.IsNotExist(err) {
		_, _ = fmt.Fprintf(os.Stderr, "creating directory: %v¥n", dirName)
		err = os.Mkdir(dirName, 0700)
		if err != nil {
			log.Fatalf("Mkdir failed: %v", err)
		}
	}

	getLoginInfo := func() (*narou.Credentials, error) {
		var prompter Prompter

		id, err := prompter.prompt("IDまたはメールアドレス")
		if err != nil {
			return nil, fmt.Errorf("prompt for id error: %v", err)
		}
		password, err := prompter.prompt("パスワード")
		if err != nil {
			return nil, fmt.Errorf("prompt for password error: %v", err)
		}
		return &narou.Credentials{Id: id, Password: password}, nil
	}

	narouSession, err := narou.NewNarouWatcher(narou.Options{
		SessionName: sessionName,
		FilePrefix:  logDir + "/",
		//GetCredentials: getLoginInfo,
	})
	if err != nil {
		log.Fatal(err)
	}
	defer narouSession.Flush(logger)

	SubCommands := []SubCommand{
		{
			"logout", func(args []string) error {
				log.Print("logout")
				return narouSession.Logout()
			},
		}, {
			"login", func(args []string) error {
				log.Print("login")
				credentials, err := getLoginInfo()
				if err != nil {
					return err
				}
				return narouSession.Login(credentials)
			},
		}, {
			"log-dir", func(args []string) error {
				fmt.Println(dirName)
				return nil
			},
		},
	}

	err = ParseArgs(SubCommands)
	if err != nil {
		narouSession.Flush(&logger)
		log.Fatal(err)
	}

	type Site struct {
		Name              string
		IsNoticeListURL   string
		IsNoticeListTitle string
	}
	sites := []Site{
		{"小説家になろう", narou.IsNoticeListURL, narou.IsNoticeListR18URL},
		{"小説家になろう(R18)", narou.IsNoticeListR18URL, narou.IsNoticeListR18Title},
	}

	openCount := 0

	for _, site := range sites {
		page, err := narouSession.GetPage(site.IsNoticeListURL)
		if err != nil {
			log.Fatalf("GetPage(%v) failed: %v", site.IsNoticeListURL, err)
		}

		results, err := narou.ParseIsNoticeList(page, site.IsNoticeListTitle)
		if err != nil {
			narouSession.Flush(&logger)
			log.Fatal(err)
		}

		updates := filterUpdates(results.Items)
		if len(updates) == 0 {
			continue
		}

		logger.Printf("\n")
		logger.Printf("%v\n", site.Name)
		logger.Printf("\n")

		for _, item := range updates {
			logger.Printf("%v: %v(%v) %v/%v(未読%v) '%v'\n",
				item.NovelID,
				item.UpdateTime.Format("2006/01/02 15:04"),
				FormatDuration(time.Since(item.UpdateTime)),
				item.BookmarkEpisode,
				item.LatestEpisode,
				item.LatestEpisode-item.BookmarkEpisode,
				item.Title,
			)
			logger.Printf(" -> %v\n", item.NextEpisode())
			if openCount < maxOpen && item.NextEpisode().Episode <= item.LatestEpisode {
				openCount++
				_ = open.Run(item.NextEpisode().URL())
			}
		}
		logger.Printf("%v items.\n", len(updates))
	}
}
