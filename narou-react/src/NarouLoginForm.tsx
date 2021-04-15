import { useCallback, useRef, useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';

export function NarouLoginForm(props: { server: string; onLogin: () => void; }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const postLogin = useCallback(async () => {
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('password', password);
    console.log(formData);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch(`${props.server}/narou/login`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (json) {
      props.onLogin();
    }
  }, [userId, password, props]);

  const passwordRef = useRef<HTMLInputElement>();

  return (<form id="loginForm">
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
  </form>);
}
