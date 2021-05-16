import { useCallback, useRef, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { NarouApi } from './narouApi/NarouApi';

export function NarouLoginForm(props: { api: NarouApi; onLogin: () => void; }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const postLogin = useCallback(async () => {
    const res: Response = await props.api.login(userId, password);
    if (!res.ok) {
      const text = await res.text();
      setError(`${res.status} ${res.statusText}\n${text}`);
    } else {
      props.onLogin();
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
    <Container maxWidth="sm">
      <Card raised={true} >
        <CardHeader title="小説家になろうのログイン情報">
        </CardHeader>
        <CardContent>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <TextField id="id" name="id" label="ID or email" autoFocus
              value={userId} onChange={e => setUserId(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  passwordRef.current?.focus();
                }
              }} />
            <TextField id="password" name="password" label="password" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              inputRef={passwordRef} onKeyPress={e => {
                if (e.key === 'Enter') {
                  postLogin();
                }
              }} />
          </Box>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={postLogin}>login</Button>
        </CardActions>
      </Card>
    </Container>
  </>);
}
