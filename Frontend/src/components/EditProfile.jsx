import React, { useContext, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext';

const EditProfile = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const { userData, setUserData, edit, setEdit } = useContext(UserDataContext);

  const [formData, setFormData] = useState({
    skills: userData.skills || [],
    headLine: userData.headLine || '',
    education: userData.education || [],
    location: userData.location || '',
    gender: userData.gender || '',
    experience: userData.experience || [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [educationInput, setEducationInput] = useState({
    college: '',
    degree: '',
    fieldOfStudy: '',
  });
  const [experienceInput, setExperienceInput] = useState({
    title: '',
    company: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addEducation = () => {
    if (educationInput.college && educationInput.degree) {
      setFormData({
        ...formData,
        education: [...formData.education, educationInput],
      });
      setEducationInput({ college: '', degree: '', fieldOfStudy: '' });
    }
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    if (experienceInput.title && experienceInput.company) {
      setFormData({
        ...formData,
        experience: [...formData.experience, experienceInput],
      });
      setExperienceInput({ title: '', company: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${serverUrl}/user/updateprofile`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        },
      );
      const data = response.data.data.user;
      setUserData(data);
      setEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-[100] flex h-[100vh] w-full items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-[200] h-[90vh] w-[90%] max-w-[600px] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <div
          className="absolute top-[20px] right-[20px] cursor-pointer"
          onClick={() => setEdit(false)}
        >
          <RxCross2 className="h-[25px] w-[25px] font-bold text-gray-800" />
        </div>
        <h2 className="mb-4 text-xl font-semibold">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Headline */}
          <input
            type="text"
            name="headLine"
            placeholder="Headline"
            value={formData.headLine}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />

          {/* Gender */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Skills */}
          <div className="rounded border p-3">
            <label className="mb-2 block font-medium">Skills</label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                placeholder="Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 rounded border px-3 py-2"
              />
              <button
                type="button"
                onClick={addSkill}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="rounded border p-3">
            <label className="mb-2 block font-medium">Education</label>
            <div className="mb-2 flex flex-col gap-2">
              <input
                type="text"
                placeholder="College"
                value={educationInput.college}
                onChange={(e) =>
                  setEducationInput({
                    ...educationInput,
                    college: e.target.value,
                  })
                }
                className="rounded border px-3 py-2"
              />
              <input
                type="text"
                placeholder="Degree"
                value={educationInput.degree}
                onChange={(e) =>
                  setEducationInput({
                    ...educationInput,
                    degree: e.target.value,
                  })
                }
                className="rounded border px-3 py-2"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={educationInput.fieldOfStudy}
                onChange={(e) =>
                  setEducationInput({
                    ...educationInput,
                    fieldOfStudy: e.target.value,
                  })
                }
                className="rounded border px-3 py-2"
              />
              <button
                type="button"
                onClick={addEducation}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Add Education
              </button>
            </div>
            {formData.education.map((edu, idx) => (
              <div
                key={idx}
                className="mb-2 flex items-center justify-between rounded bg-gray-100 px-3 py-2"
              >
                {edu.college} - {edu.degree}
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="rounded border p-3">
            <label className="mb-2 block font-medium">Experience</label>
            <div className="mb-2 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Title"
                value={experienceInput.title}
                onChange={(e) =>
                  setExperienceInput({
                    ...experienceInput,
                    title: e.target.value,
                  })
                }
                className="rounded border px-3 py-2"
              />
              <input
                type="text"
                placeholder="Company"
                value={experienceInput.company}
                onChange={(e) =>
                  setExperienceInput({
                    ...experienceInput,
                    company: e.target.value,
                  })
                }
                className="rounded border px-3 py-2"
              />
              <textarea
                placeholder="Description"
                value={experienceInput.description}
                onChange={(e) =>
                  setExperienceInput({
                    ...experienceInput,
                    description: e.target.value,
                  })
                }
                className="rounded border px-3 py-2"
              />
              <button
                type="button"
                onClick={addExperience}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Add Experience
              </button>
            </div>
            {formData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="mb-2 flex items-center justify-between rounded bg-gray-100 px-3 py-2"
              >
                {exp.title} @ {exp.company}
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full rounded bg-blue-500 py-2 text-white"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
