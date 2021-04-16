import { useCallback, useRef, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

export function NarouLoginForm(props: { server: string; onLogin: () => void; }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const postLogin = useCallback(async () => {
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('password', password);
    console.log(formData);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res: Response = await fetch(`${props.server}/narou/login`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (!res.ok) {
      const text = await res.text();
      setError(`${res.status} ${res.statusText}\n${text}`);
    } else {
      const json = await res.json();
      if (json) {
        props.onLogin();
      }
    }
  }, [userId, password, props]);

  const passwordRef = useRef<HTMLInputElement>();

  const closeError = useCallback(() => {
    setError('');
    passwordRef.current?.focus();
  }, []);

  return (<>
    <Dialog open={error !== ''} onClose={() => closeError()}>
      <DialogTitle>ログインできませんでした</DialogTitle>
      <DialogContent>
        <pre>{error}</pre>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => closeError()}>OK</Button>
      </DialogActions>
    </Dialog>
    <form id="loginForm">
      <h2>小説家になろうのログイン情報</h2>
      <Box>
        <TextField id="id" name="id" label="ID or email" autoFocus
          value={userId} onChange={e => setUserId(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              passwordRef.current?.focus();
            }
          }}></TextField>
      </Box>
      <Box><TextField id="password" name="password" label="password" type="password"
        value={password} onChange={e => setPassword(e.target.value)}
        inputRef={passwordRef} onKeyPress={e => {
          if (e.key === 'Enter') {
            postLogin();
          }
        }}></TextField></Box>
      <Button onClick={postLogin}>login</Button>
    </form>
  </>);
}
