import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";

export type ItemsState = {
  items?: IsNoticeListItem[];
  numNewItems: number | null;
  selectedIndex: number;
  defaultIndex: number;
};

export const InitialItemsState: ItemsState = {
  numNewItems: null,
  selectedIndex: -1,
  defaultIndex: -1,
};

export type SelectCommand = 'up' | 'down' | 'home' | 'end' | 'default';

export type StateAction =
  | { type: 'set', items: IsNoticeListItem[] | undefined; bookmark?: boolean }
  | { type: 'select', index: number }
  | { type: 'select-command', command: SelectCommand }

export function itemsStateReducer(state: ItemsState, action: StateAction): ItemsState {
  switch (action.type) {
    case 'set':
      {
        if (!action.items) {
          return InitialItemsState;
        }

        // 未読があって少ない順にし、未読がある場合、同じ未読数同士は更新日時昇順、未読がない場合は更新日時降順
        const items = (action.bookmark ? action.items : action.items.sort((a, b) => {
          return compare(a, b,
            i => score(i),
            a.bookmark < a.latest ?
              i => i.update_time.toMillis() :
              reverse(i => i.update_time.toMillis()),
            i => i.base_url);
        }))
          .slice(0, 30);

        const head = items[0];
        const index = head && head.bookmark < head.latest ? 0 : -1;
        return {
          ...state,
          items,
          numNewItems: items.filter(i => i.bookmark < i.latest).length,
          selectedIndex: index,
          defaultIndex: index,
        };
      }

    case 'select':
      if (state.items !== undefined) {
        const selectedIndex = Math.max(Math.min(action.index, state.items.length - 1), -1);
        if (selectedIndex !== state.selectedIndex) {
          return { ...state, selectedIndex };
        }
      }
      return state;

    case 'select-command':
      if (state.items !== undefined) {
        let selectedIndex = state.selectedIndex;
        switch (action.command) {
          case 'up':
            selectedIndex = Math.max(state.selectedIndex - 1, 0);
            break;
          case 'down':
            selectedIndex = Math.min(state.selectedIndex + 1, state.items.length - 1);
            break;
          case 'home':
            selectedIndex = 0;
            break;
          case 'end':
            selectedIndex = state.items.length - 1;
            break;
          case 'default':
            selectedIndex = state.defaultIndex;
            break;
        }
        if (selectedIndex !== state.selectedIndex) {
          return { ...state, selectedIndex };
        }
      }
      return state;
  }
}

// sort用の比較関数
function ascend<T>(a: T, b: T, f: (v: T) => (number | string)): -1 | 0 | 1 {
  const fa = f(a), fb = f(b);
  if (fa < fb) return -1;
  if (fa > fb) return 1;
  return 0;
}

type Reverse<T> = {
  f: (v: T) => number | string
}
function reverse<T>(f: (v: T) => (number | string)): Reverse<T> {
  return { f };
}

function compare<T>(a: T, b: T, ...comparators: (((v: T) => (number | string)) | Reverse<T>)[]): -1 | 0 | 1 {
  for (const f of comparators) {
    let c;
    if (typeof f === 'object') {
      c = ascend(b, a, (f as Reverse<T>).f);
    } else {
      c = ascend(a, b, f);
    }
    if (c) return c;
  }
  return 0;
}

const score = (i: IsNoticeListItem) => {
  if (i.bookmark === i.latest) return Number.MAX_SAFE_INTEGER;
  if (i.bookmark > i.latest) return Number.MAX_SAFE_INTEGER - 1;
  return i.latest - i.bookmark;
}
