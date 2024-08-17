import { useMemo } from "react"
import useSWR from "swr"
import { NarouApi } from "./NarouApi"
import { ApiError } from "./ApiError";

export type BookmarkInfo = Record<number, {
        name: string;
        num_items: number;
    }>;

interface BookmarkInfoRecord {
    no: number;
    name: string;
    num_items: number;
}

export function useBookmarkInfo(api: NarouApi | null, r18: boolean) {
    const { data, error } = useSWR<BookmarkInfoRecord[], ApiError>(
        api ?
            (r18 ? NarouApi.bookmarksR18() : NarouApi.bookmarks())
            :
            null,
        async (key: string) => api ? api.call<BookmarkInfoRecord[]>(key) : [],
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