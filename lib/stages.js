export const flowStages = [
  {
    href: "/time-loss",
    short: "Уақыт",
    title: "Уақыт кетіп жатыр"
  },
  {
    href: "/loss-timer",
    short: "Потеря",
    title: "Қаржы азаюы"
  },
  {
    href: "/cycle",
    short: "Цикл",
    title: "Тәуелділік циклі"
  },
  {
    href: "/probability",
    short: "E",
    title: "Ықтималдық"
  },
  {
    href: "/monte-carlo",
    short: "1000",
    title: "Monte Carlo"
  },
  {
    href: "/illusion",
    short: "Серия",
    title: "Жеңіс иллюзиясы"
  },
  {
    href: "/particles-interaction",
    short: "Импульс",
    title: "Жылдам шешім"
  },
  {
    href: "/gesture-game",
    short: "Қол",
    title: "Сенсорлық қорғаныс"
  },
  {
    href: "/spider-mind",
    short: "Ой",
    title: "Ой паутинасы"
  },
  {
    href: "/final",
    short: "Қорытынды",
    title: "Нәтиже"
  }
];

export function getStageIndex(pathname) {
  return flowStages.findIndex((stage) => stage.href === pathname);
}

export function getNextStage(pathname) {
  const index = getStageIndex(pathname);
  if (index < 0 || index === flowStages.length - 1) {
    return null;
  }

  return flowStages[index + 1];
}
