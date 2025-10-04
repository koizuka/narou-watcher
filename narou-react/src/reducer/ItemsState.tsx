import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";

export const BEWARE_TIME = 3 * 60 * 1000;

export interface ItemsState {
  items?: IsNoticeListItem[];
  numNewItems: number | null;
  selectedIndex: number;
  defaultIndex: number;
  clearedBewareItems: Map<string, number>; // base_url -> cleared timestamp
}

export const InitialItemsState: ItemsState = {
  numNewItems: null,
  selectedIndex: -1,
  defaultIndex: -1,
  clearedBewareItems: new Map(),
};

export type SelectCommand = 'up' | 'down' | 'home' | 'end' | 'default';

export type StateAction =
  | { type: 'set', items: IsNoticeListItem[] | undefined; bookmark?: boolean }
  | { type: 'select', index: number }
  | { type: 'select-command', command: SelectCommand }
  | { type: 'clear-beware', baseUrl: string }
  | { type: 'refresh-beware' }

export function itemsStateReducer(state: ItemsState, action: StateAction): ItemsState {
  switch (action.type) {
    case 'set':
      {
        if (!action.items) {
          return InitialItemsState;
        }

        const now = Date.now();
        const clearedBewareItems = new Map(state.clearedBewareItems);

        // Remove expired cleared records
        for (const [baseUrl, clearedTime] of clearedBewareItems.entries()) {
          if (now - clearedTime > BEWARE_TIME) {
            clearedBewareItems.delete(baseUrl);
          }
        }

        // 未読があって少ない順にし、未読がある場合、同じ未読数同士は更新日時昇順、未読がない場合は更新日時降順
        const items = (action.bookmark ? action.items : action.items.sort((a, b) => {
          return compare(a, b,
            i => score(i),
            a.bookmark < a.latest ?
              i => i.update_time.getTime() :
              reverse(i => i.update_time.getTime()),
            i => i.base_url);
        }))
          .slice(0, 30)
          .map(item => {
            // If explicitly cleared by user, keep it false
            if (clearedBewareItems.has(item.base_url)) {
              return { ...item, bewareNew: false };
            }
            // Otherwise, calculate from timestamp
            return {
              ...item,
              bewareNew: now - item.update_time.getTime() < BEWARE_TIME
            };
          });

        const head = items[0];
        const index = items[0] && head.bookmark < head.latest ? 0 : -1;
        return {
          ...state,
          items,
          numNewItems: items.filter(i => i.bookmark < i.latest).length,
          selectedIndex: index,
          defaultIndex: index,
          clearedBewareItems,
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

    case 'clear-beware':
      if (state.items !== undefined) {
        const itemIndex = state.items.findIndex(item => item.base_url === action.baseUrl);
        if (itemIndex !== -1 && state.items[itemIndex].bewareNew !== false) {
          const items = state.items.map(item =>
            item.base_url === action.baseUrl ? { ...item, bewareNew: false } : item
          );
          const clearedBewareItems = new Map(state.clearedBewareItems);
          clearedBewareItems.set(action.baseUrl, Date.now());
          return { ...state, items, clearedBewareItems };
        }
      }
      return state;

    case 'refresh-beware':
      if (state.items !== undefined) {
        const now = Date.now();
        const prevItems = state.items;
        const clearedBewareItems = new Map(state.clearedBewareItems);

        // Remove expired cleared records
        for (const [baseUrl, clearedTime] of clearedBewareItems.entries()) {
          if (now - clearedTime > BEWARE_TIME) {
            clearedBewareItems.delete(baseUrl);
          }
        }

        const items = prevItems.map(item => {
          // If explicitly cleared by user, keep it false
          if (clearedBewareItems.has(item.base_url)) {
            if (item.bewareNew !== false) {
              return { ...item, bewareNew: false };
            }
            return item;
          }

          // Otherwise, calculate from timestamp
          const newBewareNew = now - item.update_time.getTime() < BEWARE_TIME;
          if (item.bewareNew !== newBewareNew) {
            return { ...item, bewareNew: newBewareNew };
          }
          return item;
        });

        // Check if any items were actually changed (by reference comparison)
        const hasChanged = items.some((item, index) => item !== prevItems[index]);
        const clearedChanged = clearedBewareItems.size !== state.clearedBewareItems.size;

        if (hasChanged || clearedChanged) {
          return { ...state, items, clearedBewareItems };
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

interface Reverse<T> {
  f: (v: T) => number | string
}
function reverse<T>(f: (v: T) => (number | string)): Reverse<T> {
  return { f };
}

function compare<T>(a: T, b: T, ...comparators: (((v: T) => (number | string)) | Reverse<T>)[]): -1 | 0 | 1 {
  for (const f of comparators) {
    let c;
    if (typeof f === 'object') {
      c = ascend(b, a, (f ).f);
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
