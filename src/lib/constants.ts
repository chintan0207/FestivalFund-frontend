// export const API_URL = "https://festivalfund-backend.onrender.com/api";
export const API_URL = "http://localhost:8081/api";
// export const API_URL = "https://api.festivalfund.live/api";


export const colors = [
  "bg-gradient-to-r from-green-500 to-emerald-500",
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-gradient-to-r from-pink-500 to-rose-500",
  "bg-gradient-to-r from-blue-500 to-cyan-500",
  "bg-gradient-to-r from-orange-500 to-amber-500",
  "bg-gradient-to-r from-red-500 to-pink-500",
];

export const contributorCategories = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Parents",
    value: "Parents",
  },
  {
    label: "Boys",
    value: "Boys",
  },
  {
    label: "Girls",
    value: "Girls",
  },
];

export const contributionStatuses = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Deposited",
    value: "deposited",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];

export const ContributionTypeEnum = {
  CASH: "cash",
  ITEM: "item",
};

export const expenseCategories = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Mahaprasad",
    value: "mahaprasad",
  },
  {
    label: "Decoration",
    value: "decoration",
  },
  {
    label: "Mandap",
    value: "mandap",
  },
  {
    label: "Sound",
    value: "sound",
  },
  {
    label: "Other",
    value: "other",
  },
];

export const AvailableContributionTypes = Object.values(ContributionTypeEnum);

export const ContributionStatusEnum = {
  DEPOSITED: "deposited",
  PENDING: "pending",
  CANCELLED: "cancelled",
};

export const AvailableContributionStatuses = Object.values(
  ContributionStatusEnum
);

export const ContributorCategoryEnum = {
  PARENT: "Parents",
  BOY: "Boys",
  GIRL: "Girls",
};

export const AvailableContributorCategories = Object.values(
  ContributorCategoryEnum
);

export const ExpenseCategoryEnum = {
  MAHAPRASAD: "Mahaprasad",
  DECORATION: "Decoration",
  MANDAP: "Mandap",
  SOUND: "Sound",
  OTHER: "Other",
};

export const AvailableExpenseCategories = Object.values(ExpenseCategoryEnum);
