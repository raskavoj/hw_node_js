export function getCzechPriorityName(priority) {
  switch (priority) {
    case 'normal':
      return 'Normální';
    case 'low':
      return 'Nízká';
    case 'high':
      return 'Vysoká';
    default:
      return priority;
  }
}
