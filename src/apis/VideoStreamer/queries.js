export const LIST_CLASSROOMS = {
  url: "/videos/",
  method: "GET",
}

export const LIST_CLASSROOM_VIDEOS = (classroom_id) => {
  return {
    url: `/videos/`,
    method: "GET",
    params: {
      classroom: classroom_id,
    },
  }
}

export const GET_CLASSROOM_VIDEO_FEED = (classroom_id, video_date) => {
  return {
    url: `/videos/${classroom_id}/${video_date}/index.json`,
    method: "GET",
  }
}

export const GET_CLASSROOM_VIDEO_PREVIEW_IMAGE = (
  classroom_id,
  video_date,
  camera_name
) => {
  return {
    url: `/videos/${classroom_id}/${video_date}/${camera_name}/output-preview-small.jpg`,
    method: "GET",
  }
}
