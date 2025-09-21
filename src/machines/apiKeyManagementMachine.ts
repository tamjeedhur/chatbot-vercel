import { createMachine, assign } from 'xstate';
import { APIKeyContext } from '@/types/interfaces';


type APIKeyEvent =
  | { type: 'USE_KEY' }
  | { type: 'RESET_DAILY_USAGE' }
  | { type: 'RESET_MONTHLY_USAGE' }
  | { type: 'SUSPEND' }
  | { type: 'REACTIVATE' }
  | { type: 'UPGRADE_PLAN'; plan: 'basic' | 'pro' | 'enterprise' }
  | { type: 'DOWNGRADE_PLAN'; plan: 'free' | 'basic' | 'pro' }
  | { type: 'SET_CUSTOM_QUOTA'; quota: number }
  | { type: 'REPORT_ERROR' }
  | { type: 'CLEAR_ERRORS' };

const apiKeyMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMAOBLA0mAngWWQGMALdAOzADoiAXdANzAGIBVAZQFEB9TDgTQDaABgC6iUKgD2sdHUllxIAB6IAzADZ1lAJwAmAIzah6oQBYjqswBoQORPoAcW7QFYHD0+b1PTL1QF9-GzQsXAIScipaBmZ2bl5BfTEkECkZOQUUlQQNZwMjE3MhS1MbOxzVVR19XSEaoQB2XxddbUDgjGx8IlIKakI6RlZOHn4BXWSJaVl0eUVs30pHDVrzdW19IWN1MsQHM0oXBv3TBwbdU01PdpAQrvDeqIGYpjZ2AAUOADkAEWFJ1LTDLzNSaHT5YxmCzWWyIbQNBrVUwNLZ+XSqDb6G53MI9SL9QbMABKHE4ABUuD8AIIASQAMnwuOwqQBxDj-RRpGZzLKINyUIRuEwudT6QqmGo7WEIFEOJYXM5HUUnBrYzq4iJ9aJDEnkrh4ADyXzJAAkGUy2Kz2aJOUDZplQAtdLsEKL9JR1A19CjdA1tA5tJ42kFburupqnoTWO8WUSqT9uO86VSvhyUlzgbyZS5KBiPC5-aZjGLTi7TnLdOoXF50bo3PoAiGceHHgSXj8DQB1L6x+OJ5Opm3pu08x2IUWHRoOVQI7SuUy1BwujSmSgOAutEWaAx+tWhFv47XMPUAYXYZINeC4AEUWAayVS01N0vaQQhqzpzLX1M06hoXZWcpFqKui+sUqj1uoe73HiWrPDqHDvAaRIUhwRJEshT6Ai+o7KKCeSGJCRQlC6Hjur6+ieD+ZhCHOpjQRqrZHkwSiwDQyA0FEABmnEAE4ABTUvSjK6hwZIAJRMM2DyHvBYBYRmr5Zn6lCtK02iWLknqei63qrq4lguMYDiEQ4dYMQecFRqx7GcdQPFgAJhrGmaImkmJknSbBkYxApI4OnhrpaBB+giiZmgNCKLSke6Xjwk4hRuDOFkyX0vEcWAdLoAAtrIkAsWxGX2Xx-FxmS3B0jSeA0hSPwsGVNJGp5YapVQ6WcVluWcRAfk4QFCyqHK8JVi0qjmEW-oNLpGKUL47hmOYAZ1roDgpd5lCSIwvHXgArpI7HRr2CZcEmKa9dy-WIKc2genWWyVDOgr6MuHizfUxYaYNlH0U2LXrZtjm7ftyCvGJXBnmwF5Xre96PkOz4XW+nhyucVbXZcZlCEu0pGYiJmY-CBZNOYLhrRGG1bUDB2iRSzmmuazJsudmZjggC66GuK1YxoLj1vsqgATOs1uNOmJihpWK-furWULAO2wKgYBkBA+UklSJ5kjSABqVLlczSms4GiKFpUrgFj+lwup6q4tA266aKohGk1LMHk45vGSLxJ7EGAhAANbkFATD67h2RkUswFCKBGlE890pOEISKaE4Gw-hiZOtu7nve77AdkEHAhJLafVvkZN0bEW6LhWYooun6OYUYNvqgYUq03GQkgq-AKReRGxeI1mAC0UrlIPOZzhPk9T42HTS+tR79yzgX6KFuZOF6GxY0Znguq45czqYlgGJsLS6Bn+LtZlOV5RAi8G4F6hmZQTRzgGKKnB-ukmWukUuJKGKowXOfPoANtp7XYnfUO44n4v39PCMwHgPBllXn-P+K8jItCrNoKCLtGL4jlgrJWKtb7DhLlmFexRJzHCxlsYo7gR57AnFcFEY1zjDTbrPV2mdeIey9j7f2gdIGXVdDArwb8EGf3jgWJYP4WHIlaA0R+gRAhAA */
  id: 'apiKeyMachine',
  initial: 'active',
  context: {
    key: '',
    owner: '',
    createdAt: new Date(),
    lastUsed: null,
    usageCount: 0,
    dailyUsage: 0,
    monthlyUsage: 0,
    rateLimit: {
      perSecond: 5,
      perMinute: 100,
      perHour: 1000,
    },
    limits: {
      daily: 10000,
      monthly: 250000,
    },
    lastResetDate: {
      daily: new Date(),
      monthly: new Date(),
    },
    consecutiveErrors: 0,
    warningThresholds: {
      daily: 0.8,
      monthly: 0.8,
    },
    plan: 'basic',
    customQuota: null,
  } as APIKeyContext,
  states: {
    active: {
      on: {
        USE_KEY: [
          {
            target: 'rateLimited',
            guard: 'isRateLimitExceeded',
          },
          {
            target: 'overQuota',
            guard: 'isOverQuota',
          },
          {
            target: 'active',
            actions: ['incrementUsage', 'checkLimits', 'updateLastUsed'],
          },
        ],
        SUSPEND: 'suspended',
        RESET_DAILY_USAGE: {
          actions: 'resetDailyUsage',
        },
        RESET_MONTHLY_USAGE: {
          actions: 'resetMonthlyUsage',
        },
        UPGRADE_PLAN: {
          actions: ['upgradePlan', 'adjustLimits'],
        },
        DOWNGRADE_PLAN: {
          actions: ['downgradePlan', 'adjustLimits'],
        },
        SET_CUSTOM_QUOTA: {
          actions: 'setCustomQuota',
        },
        REPORT_ERROR: {
          actions: 'incrementErrors',
          target: 'errorChecking',
        },
      },
      after: {
        DAILY_RESET: {
          actions: 'resetDailyUsage',
        },
        MONTHLY_RESET: {
          actions: 'resetMonthlyUsage',
        },
      },
    },
    rateLimited: {
      after: {
        RATE_LIMIT_DURATION: 'active',
      },
    },
    overQuota: {
      on: {
        UPGRADE_PLAN: {
          target: 'active',
          actions: ['upgradePlan', 'adjustLimits'],
        },
        SET_CUSTOM_QUOTA: {
          target: 'active',
          actions: 'setCustomQuota',
        },
        RESET_MONTHLY_USAGE: {
          target: 'active',
          actions: 'resetMonthlyUsage',
        },
      },
    },
    suspended: {
      on: {
        REACTIVATE: 'active',
      },
    },
    errorChecking: {
      always: [
        {
          target: 'suspended',
          guard: 'tooManyConsecutiveErrors',
        },
        {
          target: 'active',
        },
      ],
    },
  },
}, {
  actions: {
    incrementUsage: assign({
      usageCount: ({context}) => context.usageCount + 1,
      dailyUsage: ({context}) => context.dailyUsage + 1,
      monthlyUsage: ({context}) => context.monthlyUsage + 1,
    }),
    updateLastUsed: assign({
      lastUsed: (_) => new Date(),
    }),
    resetDailyUsage: assign({
      dailyUsage: 0,
      lastResetDate: ({context}) => ({
        ...context.lastResetDate,
        daily: new Date(),
      }),
    }),
    resetMonthlyUsage: assign({
      monthlyUsage: 0,
      lastResetDate: ({context}) => ({
        ...context.lastResetDate,
        monthly: new Date(),
      }),
    }),
    checkLimits: ({context}) => {
      const { dailyUsage, monthlyUsage, limits, warningThresholds } = context;
      if (dailyUsage >= limits.daily * warningThresholds.daily) {
        console.warn(`Daily usage warning for key: ${context.key}`);
      }
      if (monthlyUsage >= limits.monthly * warningThresholds.monthly) {
        console.warn(`Monthly usage warning for key: ${context.key}`);
      }
    },
    upgradePlan: assign({
      plan: ({context, event}) => event.plan,
    }),
    downgradePlan: assign({
      plan: ({context, event}) => event.plan,
    }),
    adjustLimits: assign({
      limits: ({context}) => {
        switch (context.plan) {
          case 'free':
            return { daily: 1000, monthly: 10000 };
          case 'basic':
            return { daily: 10000, monthly: 250000 };
          case 'pro':
            return { daily: 50000, monthly: 1000000 };
          case 'enterprise':
            return { daily: 1000000, monthly: 25000000 };
          default:
            return context.limits;
        }
      },
      rateLimit: ({context}) => {
        switch (context.plan) {
          case 'free':
            return { perSecond: 2, perMinute: 30, perHour: 500 };
          case 'basic':
            return { perSecond: 5, perMinute: 100, perHour: 1000 };
          case 'pro':
            return { perSecond: 10, perMinute: 300, perHour: 3000 };
          case 'enterprise':
            return { perSecond: 50, perMinute: 1000, perHour: 10000 };
          default:
            return context.rateLimit;
        }
      },
    }),
    setCustomQuota: assign({
      customQuota: ({context, event}) => event.quota,
    }),
    incrementErrors: assign({
      consecutiveErrors: ({context}) => context.consecutiveErrors + 1,
    }),
  },
  guards: {
    isRateLimitExceeded: ({context}) => {
      const now = new Date();
      const oneSecondAgo = new Date(now.getTime() - 1000);
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      const oneHourAgo = new Date(now.getTime() - 3600000);

      const recentUsage = (date: Date | null) => date && date > oneSecondAgo;
      const lastMinuteUsage = (date: Date | null) => date && date > oneMinuteAgo;
      const lastHourUsage = (date: Date | null) => date && date > oneHourAgo;

      return (
        (recentUsage(context.lastUsed) && context.usageCount % context.rateLimit.perSecond === 0) ||
        (lastMinuteUsage(context.lastUsed) && context.usageCount % context.rateLimit.perMinute === 0) ||
        (lastHourUsage(context.lastUsed) && context.usageCount % context.rateLimit.perHour === 0)
      ) || false; // Ensure a boolean is always returned
    },
    isOverQuota: ({context}) => {
      const effectiveMonthlyLimit = context.customQuota || context.limits.monthly;
      return context.monthlyUsage >= effectiveMonthlyLimit || context.dailyUsage >= context.limits.daily;
    },
    tooManyConsecutiveErrors: ({context}) => context.consecutiveErrors >= 5,
  },
  delays: {
    DAILY_RESET: ({context}) => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      return tomorrow.getTime() - now.getTime();
    },
    MONTHLY_RESET: ({context}) => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return nextMonth.getTime() - now.getTime();
    },
    RATE_LIMIT_DURATION: 60000, // 1 minute
  },
});

export default apiKeyMachine;