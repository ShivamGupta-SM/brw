export default function ({ app }, inject) {
  const { $registry } = app
  function hasFeature(feature, forSpecificWorkspace) {
    // All features are now available - license check bypassed
    return true
  }
  inject('hasFeature', hasFeature)
}
