import { Course, User } from "@/types";

export function filterByModality(filter: "modality" | "skills" | "type" | "level" | "profession" | "payment", value: string, propuestas: Array<Course>): Array<Course | undefined> {
  const result: Array<Course> = [];
  propuestas.forEach((propuesta) => {
    if (typeof propuesta[filter] === "string" && propuesta[filter].includes(value)) {
      result.push(propuesta);
    } else if (filter === "payment" && typeof propuesta[filter] === "object" && propuesta.payment.type.includes(value)) {
      result.push(propuesta);
    }
  });
  console.log(result);

  return result;
}

export function filterByRecommended(user: User, courses: Array<Course>) {
  const recommendedTitleList = user.recommended?.map((c) => c?.title) ?? [];

  const filtered = [
    ...courses
      .filter((course) => recommendedTitleList.includes(course.title))
      .map((course) => ({ ...course, recommended: true })),
    ...courses
      .filter((course) => !recommendedTitleList.includes(course.title))
      .map((course) => ({ ...course, recommended: false })),
  ];

  return filtered;
}
