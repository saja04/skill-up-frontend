import { Course, Filter } from '@/types'
import courses from '../courses.json'



export default function getAllFilters() {
    const filters: Filter = {
        modality: [],
        skills: [],
        type: [],
        level: [],
        profession: [],
        payment: [],
    }
    courses.map((course: Course) => {
        if(!filters.modality.includes(course.modality)) {
            filters.modality.push(course.modality)
        }
        if(!filters.type.includes(course.type)) {
            filters.type.push(course.type)
        }
        if(!filters.level.includes(course.level)) {
            filters.level.push(course.level)
        }
        if(!filters.profession.includes(course.profession)) {
            filters.profession.push(course.profession)
        }
        if(!filters.payment.includes(course.payment.type)) {
            filters.payment.push(course.payment.type)
        }
        course.skills.map((skill) => {
            if(!filters.skills.includes(skill)) {
                filters.skills.push(skill)
            }
        })
    })
    return filters;
    
}
