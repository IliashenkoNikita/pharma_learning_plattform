import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { mockCourses } from '../data/mockData';
import { CourseStatus } from '../types';

export function CourseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';
  const existingCourse = isEditing ? mockCourses.find((c) => c.id === id) : null;

  const [formData, setFormData] = useState({
    title: existingCourse?.title || '',
    description: existingCourse?.description || '',
    category: existingCourse?.category || '',
    status: existingCourse?.status || CourseStatus.Draft,
    estimatedDurationMinutes: existingCourse?.estimatedDurationMinutes || 60,
    thumbnailUrl: existingCourse?.thumbnailUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving course:', formData);
    navigate('/courses');
  };

  return (
    <div className="max-w-3xl">
      <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">
          {isEditing ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update course details and content' : 'Add a new training course to the platform'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Pharmaceutical Regulations & Compliance"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Provide a detailed description of the course content and learning objectives..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Regulatory Affairs"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as CourseStatus })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={CourseStatus.Draft}>Draft</option>
                <option value={CourseStatus.Published}>Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration (minutes) *
            </label>
            <input
              type="number"
              value={formData.estimatedDurationMinutes}
              onChange={(e) =>
                setFormData({ ...formData, estimatedDurationMinutes: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.thumbnailUrl && (
              <div className="mt-3">
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />
              {isEditing ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
