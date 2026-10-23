import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import { NarouApi } from '../narouApi/NarouApi';

export function NarouLoginForm(props: { api: NarouApi; onLogin: () => void; }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 二段階認証待ちのとき authtoken が入る
  const [authToken, setAuthToken] = useState('');
  const [totpCode, setTotpCode] = useState('');

  const completeLogin = useCallback(async () => {
    // ログイン直後に認証付きエンドポイントへアクセスしてセッションクッキー反映を確実にする
    try {
      await props.api.fetch(NarouApi.isnoticelist({ maxPage: 1 }));
    } catch {
      // 初回アクセスで401等が返っても以降の画面で再取得されるため握りつぶす
    }
    props.onLogin();
  }, [props]);

  const postLogin = useCallback(() => {
    void (async () => {
      const res: Response = await props.api.login(userId, password);
      if (!res.ok) {
        const text = await res.text();
        setError(`${res.status} ${res.statusText}\n${text}`);
        return;
      }
      const body: unknown = await res.json().catch(() => true);
      if (typeof body === 'object' && body !== null && 'totp_required' in body && 'authtoken' in body) {
        setAuthToken(String(body.authtoken));
        return;
      }
      await completeLogin();
    })();
  }, [userId, password, props, completeLogin]);

  const postTotp = useCallback(() => {
    void (async () => {
      const res: Response = await props.api.loginTOTP(authToken, totpCode.trim());
      if (!res.ok) {
        const text = await res.text();
        setError(`${res.status} ${res.statusText}\n${text}`);
        return;
      }
      setAuthToken('');
      setTotpCode('');
      await completeLogin();
    })();
  }, [authToken, totpCode, props, completeLogin]);

  const passwordRef = useRef<HTMLInputElement>(undefined);

  const closeError = useCallback(() => {
    setError('');
    passwordRef.current?.focus();
  }, []);

  return (<>
    <Dialog open={error !== ''} onClose={() => { closeError(); }}>
      <DialogTitle>ログインできませんでした</DialogTitle>
      <DialogContent>
        <pre>{error}</pre>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => { closeError(); }}>OK</Button>
      </DialogActions>
    </Dialog>
    {authToken !== '' ? <Container maxWidth="sm">
      <Card raised={true} >
        <CardHeader title="二段階認証コード" data-testid="totp-page"
          subheader="認証アプリ(Google Authenticator)に表示されたコードを入力してください" />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TextField id="totp" name="totp" label="認証コード" autoFocus autoComplete="one-time-code"
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              value={totpCode} onChange={e => { setTotpCode(e.target.value); }}
              onKeyDown={e => {
                if (e.defaultPrevented) return;
                if (e.key === 'Enter') {
                  postTotp();
                }
              }} data-testid="totp" />
          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Button onClick={() => { setAuthToken(''); setTotpCode(''); }} data-testid="totp-cancel">戻る</Button>
          <Button variant="contained" onClick={postTotp} data-testid="totp-submit">認証する</Button>
        </CardActions>
      </Card>
    </Container> : <Container maxWidth="sm">
      <Card raised={true} >
        <CardHeader title="小説家になろうのログイン情報" data-testid="login-page">
        </CardHeader>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TextField id="id" name="id" label="ID or email" autoFocus
              value={userId} onChange={e => { setUserId(e.target.value); }}
              onKeyDown={e => {
                if (e.defaultPrevented) return;
                if (e.key === 'Enter') {
                  passwordRef.current?.focus();
                }
              }} data-testid="id" />
            <TextField id="password" name="password" label="password" type="password"
              value={password} onChange={e => { setPassword(e.target.value); }}
              inputRef={passwordRef} onKeyDown={e => {
                if (e.defaultPrevented) return;
                if (e.key === 'Enter') {
                  postLogin();
                }
              }} data-testid="password" />
          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={postLogin} data-testid="login">login</Button>
        </CardActions>
      </Card>
    </Container>}
  </>);
}
