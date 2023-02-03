package narou

import "fmt"

type TitleMismatchError struct {
	Got  string
	Want string
}

func (error TitleMismatchError) Error() string {
	return fmt.Sprintf("title mismatch: got:'%v', want:'%v'", error.Got, error.Want)
}

type UnmarshalError struct {
	Err error
}

func (error UnmarshalError) Error() string {
	return fmt.Sprintf("unmarshal error: %v", error.Err)
}
