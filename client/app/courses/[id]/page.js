'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../services/api";

export default function CourseDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    let ignore = false;

    Promise.all([
      api.get(`/course/${id}`),
      api.get("/rating/all", { params: { courseId: id } }),
      api.get(`/rating/average/${id}`),
    ])
      .then(([courseRes, reviewsRes, averageRes]) => {
        if (!ignore) {
          setCourse(courseRes.data.data);
          setReviews(reviewsRes.data.data || []);
          setAverageRating(Number(averageRes.data.averageRating || 0));
        }
      })
      .catch((err) => {
        console.log(err.response?.data || err);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleBuy = () => {
    router.push(`/payment/${id}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await api.post("/rating/create", {
        courseId: id,
        rating: Number(reviewForm.rating),
        review: reviewForm.review,
      });

      const [reviewsRes, averageRes] = await Promise.all([
        api.get("/rating/all", { params: { courseId: id } }),
        api.get(`/rating/average/${id}`),
      ]);

      setReviews(reviewsRes.data.data || []);
      setAverageRating(Number(averageRes.data.averageRating || 0));
      setReviewForm({ rating: 5, review: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Unable to submit review");
      console.log(err.response?.data || err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!course) {
    return <p className="text-white text-center mt-20">Loading...</p>;
  }

  const instructorName = `${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`.trim() || "Instructor";

  return (
    <div className="bg-[#0f172a] text-white min-h-screen">
      <div className="relative h-[300px]">
        <img
          src={course.thumbnail}
          alt={course.courseName}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />

        <div className="absolute bottom-6 left-6 max-w-3xl">
          <h1 className="text-4xl font-bold">{course.courseName}</h1>
          <p className="text-gray-300 mt-2">{course.courseDescription}</p>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
            <span>Rating {averageRating.toFixed(1)}</span>
            <span>{course.studentsEnrolled?.length || 0} students</span>
            <span>{instructorName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 px-6 py-10">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-3 mb-8">
            <img src={course.thumbnail} alt={course.courseName} className="rounded-lg h-28 object-cover" />
            <img src={course.thumbnail} alt={course.courseName} className="rounded-lg h-28 object-cover" />
            <img src={course.thumbnail} alt={course.courseName} className="rounded-lg h-28 object-cover" />
          </div>

          <div className="flex gap-6 border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-2 ${activeTab === "overview" ? "border-b-2 border-indigo-500 text-indigo-400" : ""}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`pb-2 ${activeTab === "curriculum" ? "border-b-2 border-indigo-500 text-indigo-400" : ""}`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 ${activeTab === "reviews" ? "border-b-2 border-indigo-500 text-indigo-400" : ""}`}
            >
              Reviews
            </button>
          </div>

          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-semibold mb-3">What you will learn</h2>
              <p className="text-gray-300">{course.whatYouWillLearn}</p>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Course Content</h2>
              <div className="space-y-3">
                {course.courseContent?.length ? course.courseContent.map((section, index) => (
                  <div key={section._id} className="bg-white/5 p-4 rounded-lg">
                    <p className="font-medium">Section {index + 1}: {section.sectionName}</p>
                    {section.subSection?.length ? (
                      <div className="mt-2 space-y-2">
                        {section.subSection.map((item) => (
                          <div key={item._id} className="rounded-md bg-black/20 px-3 py-2 text-sm text-gray-300">
                            <p>{item.title}</p>
                            <p className="text-xs text-gray-400">{item.timeDuration}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-2">No lessons added yet</p>
                    )}
                  </div>
                )) : (
                  <p className="text-gray-400">No sections added yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <h2 className="text-xl font-semibold">Average Rating</h2>
                <p className="mt-2 text-4xl font-bold text-yellow-400">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-gray-400 mt-1">{reviews.length} reviews</p>
              </div>

              {user?.accountType === "Student" && (
                <form onSubmit={handleReviewSubmit} className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-4">
                  <h3 className="text-lg font-semibold">Add your review</h3>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    className="input w-full bg-[#020617]"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} Star
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={reviewForm.review}
                    onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                    placeholder="Write your comment"
                    className="input w-full h-28"
                  />
                  <button
                    disabled={submittingReview}
                    className="rounded-lg bg-indigo-500 px-4 py-2"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {reviews.length ? reviews.map((item) => (
                  <div key={item._id} className="rounded-xl bg-white/5 border border-white/10 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">
                        {item.user?.firstName} {item.user?.lastName}
                      </p>
                      <p className="text-yellow-400">{item.rating}/5</p>
                    </div>
                    <p className="mt-2 text-gray-300">{item.review}</p>
                  </div>
                )) : (
                  <p className="text-gray-400">No reviews yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-fit sticky top-24">
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="rounded-lg mb-4"
          />

          <p className="text-3xl font-bold text-indigo-400 mb-4">₹{course.price}</p>

          {user?.accountType === "Instructor" ? (
            <p className="text-yellow-400">Instructors cannot purchase</p>
          ) : (
            <button
              onClick={handleBuy}
              className="w-full bg-indigo-500 py-3 rounded-lg hover:bg-indigo-600"
            >
              Buy Now
            </button>
          )}

          <div className="mt-4 text-sm text-gray-400 space-y-2">
            <p>Full lifetime access</p>
            <p>Access on mobile and desktop</p>
            <p>Certificate of completion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
