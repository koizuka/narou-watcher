type Api = '/narou/login' | '/narou/logout' | '/narou/isnoticelist' | '/r18/isnoticelist';

export class NarouApi {
    private server: string;

    constructor(server: string) {
        this.server = server.replace(/\/$/, '');
    }

    async fetch(api: Api): Promise<Response> {
        return fetch(`${this.server}${api}`, {
            credentials: 'include',
        });
    }

    async login(id: string, password: string): Promise<Response> {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('password', password);
        const res: Response = await fetch(`${this.server}/narou/login`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        return res;
    }

    async logout(): Promise<void> {
        await this.fetch('/narou/logout');
    }

    async call(api: '/narou/isnoticelist' | '/r18/isnoticelist') {
        const res = await this.fetch(api);
        if (!res.ok) {
            throw res;
        }
        return res.json();
    }
}