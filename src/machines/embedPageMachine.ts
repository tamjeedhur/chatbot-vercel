import { setup, assign } from 'xstate';

// Types
export interface EmbedPageContext {
  activeTab: 'script' | 'iframe';
  copiedCode: string | null;
}

export type EmbedPageEvent =
  | { type: 'SWITCH_TAB'; tab: 'script' | 'iframe' }
  | { type: 'COPY_CODE'; code: string; id: string }
  | { type: 'CLEAR_COPIED' };

// Machine
export const embedPageMachine = setup({
  types: {
    context: {} as EmbedPageContext,
    events: {} as EmbedPageEvent,
  },
  actions: {
    switchTab: assign({
      activeTab: ({ event }) => (event as EmbedPageEvent & { tab: 'script' | 'iframe' }).tab,
    }),
    copyCode: assign({
      copiedCode: ({ event }) => (event as EmbedPageEvent & { id: string }).id,
    }),
    clearCopied: assign({
      copiedCode: null,
    }),
  },
}).createMachine({
  id: 'embedPage',
  initial: 'idle',
  context: {
    activeTab: 'script',
    copiedCode: null,
  },
  states: {
    idle: {
      on: {
        SWITCH_TAB: {
          actions: 'switchTab',
        },
        COPY_CODE: {
          actions: 'copyCode',
          after: {
            2000: {
              actions: 'clearCopied',
            },
          },
        },
      },
    },
  },
});
