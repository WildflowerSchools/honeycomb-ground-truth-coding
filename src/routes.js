export const ROUTE_CLASSROOM_SELECT = (classroomId = "") =>
  `/classrooms/${classroomId}`
export const ROUTE_CLASSROOM_VIDEOS = (classroomId, videoDate) =>
  `/classrooms/${classroomId}/${videoDate}`
