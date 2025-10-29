export interface CoursePayment {
  type: string;
  price_per_month?: number;
  total_price: number;
}

export interface Review {
  username: string;
  stars: number;
  review: string;
}

export interface Course {
  id: number,
  title: string;
  skills: Array<string>;
  description: string;
  duration_hours: number;
  modality: string;
  type: string;
  payment: CoursePayment;
  level: string;
  profession: string;
  reviews: Array<Review | null>;
  professional_profile: string;
  institute: string;
  week_charge: number | null;
  stars: number;
  recommended?: boolean
}

export interface CourseShort {
  title: string,
  id: number
}

export interface Filter {
  modality: Array<string | null>;
  skills: Array<string | null>;
  type: Array<string | null>;
  level: Array<string | null>;
  profession: Array<string | null>;
  payment: Array<string | null>;
}

export interface UserPreferences {
  area: string,
  level: string,
  type: string
}

export interface UserInfo {
  first_name: string,
  last_name: string,
  email: string,
  user_name: string,
  born_date: string,
}

export interface User {
  preferences: UserPreferences,
  info?: UserInfo,
  completed_courses?: Array<number>,
  reviews?: Array<Review>,
  recommended?: Array<Course | null>
}


