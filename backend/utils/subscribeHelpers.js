exports.getSubscriptionPrice = (subscriptions, feature) => {
  const subscription = subscriptions.find((sub) => sub.feature === feature);
  return subscription ? subscription.price : 0;
};
