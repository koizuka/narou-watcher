package model

// UserTopNotificationRecord はユーザートップの「新着通知」の有無を表す。
// 中身はユーザー自身がユーザーホームを開いて確認する想定で、ここでは有無と件数のみ返す。
type UserTopNotificationRecord struct {
	HasNotification bool `json:"has_notification"`
	Count           int  `json:"count"`
}
