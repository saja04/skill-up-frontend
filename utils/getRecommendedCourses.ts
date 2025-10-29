import { User, Course, CourseShort } from "@/types";
import courses from "../courses.json";

export default function getRecommendedCourses(user: User): Array<Course | null> {
  const preferences = user.preferences;
  const recommendations: Array<Course> = [];

  courses.forEach((course) => {
    if (course.profession === preferences.area && course.level === preferences.level) {
      recommendations.push(course);
    }
  });

  return recommendations;
}

export function getRecommendedCoursesShort(coursesIds: Array<number>) {
  const recommendedCoursesShort: Array<CourseShort> = [];
  courses.forEach((course) => {
    if (coursesIds.includes(course.id)) {
      recommendedCoursesShort.push({
        title: course.title,
        id: course.id,
      });
    }
  });
  return recommendedCoursesShort;
}
