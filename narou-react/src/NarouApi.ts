
/**
 * bookmarkの並びを指定する
 * * 'updated_at' ブクマ更新順
 * * 'new' ブクマ追加順
 * * 'ncode' 新着Nコード順 
 * * 'newlist' 新着更新順
 */
type BookmarkOrder = 'updated_at' | 'new' | 'ncode' | 'newlist';

/**
 * SWRのキーとして与え、 SWRのfetcharとして `key => NarouApi.call(key)` として渡す値。
 */
type NarouApiCallKey = string;

export class NarouApi {
    private server: string;

    constructor(server: string) {
        this.server = server.replace(/\/$/, '');
    }

    async fetch(api: string): Promise<Response> {
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

    async call(key: NarouApiCallKey) {
        const res = await this.fetch(key);
        if (!res.ok) {
            throw res;
        }
        return res.json();
    }

    static isnoticelist({ maxPage = 1 }: { maxPage: number }): NarouApiCallKey {
        return `/narou/isnoticelist?max_page=${maxPage}`;
    }
    static isnoticelistR18({ maxPage = 1 }: { maxPage: number }): NarouApiCallKey {
        return `/r18/isnoticelist?max_page=${maxPage}`;
    }

    static bookmarks(): NarouApiCallKey {
        return `/narou/bookmarks`;
    }
    static bookmarksR18(): NarouApiCallKey {
        return `/r18/bookmarks`;
    }

    static bookmark(no: number, { order }: { order: BookmarkOrder }): NarouApiCallKey {
        return `/narou/bookmarks/${no}?order=${order}`;
    }
    static bookmarkR18(no: number, { order }: { order: BookmarkOrder }): NarouApiCallKey {
        return `/r18/bookmarks/${no}?order=${order}`;
    }

    static novelInfo(ncode: string): NarouApiCallKey {
        return `/narou/novels/${ncode}`;
    }
    static novelInfoR18(ncode: string): NarouApiCallKey {
        return `/r18/novels/${ncode}`;
    }
}