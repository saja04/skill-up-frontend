import { Review } from "@/app/propuestas";


export function getStarsCount(reviews: Array<Review | null>): number {
    let starCount = 0
    if(reviews) {
        reviews?.forEach(review => {
            starCount += review?.stars ? review?.stars : 0
        })
        return Number((starCount / reviews.length).toFixed(1));
    }
    return 0
}