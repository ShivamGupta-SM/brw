// eslint-disable-next-line import/no-named-as-default
import posthog from 'posthog-js'
import Vue from 'vue'

export default function ({ app: { router, $config, store } }, inject) {
  // PostHog analytics disabled - no telemetry sent

  // Inject a stub posthog object to prevent errors
  const stubPosthog = {
    init: () => {},
    capture: () => {},
    identify: () => {},
    reset: () => {},
    get_distinct_id: () => null,
  }

  inject('posthog', stubPosthog)
}
