import { useMemo } from "react"
import useSWR from "swr"
import { NarouApi } from "./NarouApi"

export type BookmarkInfo = {
    [no: number]: {
        name: string;
        num_items: number;
    }
}

type BookmarkInfoRecord = {
    no: number;
    name: string;
    num_items: number;
}

export function useBookmarkInfo(api: NarouApi | null) {
    const { data, error } = useSWR<BookmarkInfoRecord[]>(api ? NarouApi.bookmarks() : null,
        key => api ? api.call(key) : [],
    )

    const info: BookmarkInfo | undefined = useMemo(() => {
        if (data) {
            return data.reduce<BookmarkInfo>((a, d) => {
                a[d.no] = {
                    name: d.name,
                    num_items: d.num_items,
                };
                return a;
            }, {});
        } else {
            return undefined;
        }
    }, [data]);

    return { data: info, error };
}