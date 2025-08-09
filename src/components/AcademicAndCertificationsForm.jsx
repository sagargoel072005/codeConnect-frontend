// AcademicAndCertificationsForm.jsx
import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const AcademicAndCertificationsForm = ({
  academicQualifications,
  setAcademicQualifications,
  certifications,
  setCertifications,
  projects,
  setProjects,
  containerStyle,
}) => {
  // Handlers
  const handleAcademicChange = (level, field, value) => {
    setAcademicQualifications((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (fieldName, index, value) => {
    let setter = fieldName === "certifications" ? setCertifications : setProjects;
    let arr = fieldName === "certifications" ? certifications : projects;

    const updated = [...arr];
    updated[index] = value;
    setter(updated);
  };

  const addArrayField = (fieldName) => {
    let setter = fieldName === "certifications" ? setCertifications : setProjects;
    let arr = fieldName === "certifications" ? certifications : projects;
    if (arr.length >= 10) return;
    setter([...arr, ""]);
  };

  const removeArrayField = (fieldName, index) => {
    let setter = fieldName === "certifications" ? setCertifications : setProjects;
    let arr = fieldName === "certifications" ? certifications : projects;
    const updated = arr.filter((_, i) => i !== index);
    setter(updated.length > 0 ? updated : [""]);
  };

  return (
    <form
      style={containerStyle}
      className="p-6 bg-gray-100 rounded-lg shadow-lg space-y-8 hide-scrollbar"
      onSubmit={(e) => e.preventDefault()} // prevent submit inside child form
    >
      <h2 className="text-3xl font-extrabold mb-6 text-indigo-800 select-none flex items-center gap-3 tracking-wide drop-shadow-md">
        Academic Qualifications
      </h2>

      {["tenth", "twelfth"].map((level) => (
        <section
          key={level}
          className="mb-6 border border-gray-300 p-4 rounded-md bg-white"
        >
          <h3 className="text-xl font-semibold mb-5 capitalize text-indigo-900 select-none tracking-wide">
            {level === "tenth" ? "10th" : "12th"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["school", "board", "percentage"].map((field) => (
              <input
                key={field}
                type={field === "percentage" ? "number" : "text"}
                min={field === "percentage" ? 0 : undefined}
                max={field === "percentage" ? 100 : undefined}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={academicQualifications[level][field]}
                onChange={(e) =>
                  handleAcademicChange(level, field, e.target.value)
                }
                className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
              />
            ))}
          </div>
        </section>
      ))}

      {["ug", "pg"].map((level) => (
        <section
          key={level}
          className="mb-6 border border-gray-300 p-4 rounded-md bg-white"
        >
          <h3 className="text-xl font-semibold mb-5 uppercase text-indigo-900 select-none tracking-wide">
            {level}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {["degree", "branch", "sgpa"].map((field) => (
              <input
                key={field}
                type={field === "sgpa" ? "number" : "text"}
                step={field === "sgpa" ? 0.01 : undefined}
                min={field === "sgpa" ? 0 : undefined}
                max={field === "sgpa" ? 10 : undefined}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={academicQualifications[level][field]}
                onChange={(e) =>
                  handleAcademicChange(level, field, e.target.value)
                }
                className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
              />
            ))}
          </div>
        </section>
      ))}

      {/* Certifications */}
      <section>
  <h2 className="text-xl font-semibold mb-5 uppercase text-indigo-900 select-none tracking-wide flex items-center gap-2">
    Certifications
    <button
      type="button"
      onClick={() => addArrayField("certifications")}
      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
      title="Add Certification"
    >
      <PlusCircle size={22} />
    </button>
  </h2>
        <div className="space-y-3">
          {certifications.map((cert, i) => (
            <div
              key={i}
              className="flex gap-3 items-center rounded-md border border-gray-300 bg-white px-4 py-2"
            >
              <input
                type="text"
                value={cert}
                onChange={(e) => handleArrayChange("certifications", i, e.target.value)}
                placeholder="Enter certification name"
                className="flex-grow input input-bordered rounded-md border-gray-300 focus:ring-indigo-600 placeholder-gray-400 transition"
              />
              {certifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField("certifications", i)}
                  className="text-red-600 hover:text-red-900 transition-colors duration-300"
                  title="Remove certification"
                >
                  <Trash2 size={22} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-5 uppercase text-indigo-900 select-none tracking-wide flex items-center gap-2">
    Projects
    <button
      type="button"
      onClick={() => addArrayField("projects")}
      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
      title="Add Project"
    >
      <PlusCircle size={22} />
    </button>
  </h2>
        <div className="space-y-3">
          {projects.map((proj, i) => (
            <div
              key={i}
              className="flex gap-3 items-center rounded-md border border-gray-300 bg-white px-4 py-2"
            >
              <input
                type="text"
                value={proj}
                onChange={(e) => handleArrayChange("projects", i, e.target.value)}
                placeholder="Enter project name"
                className="flex-grow input input-bordered rounded-md border-gray-300 focus:ring-indigo-600 placeholder-gray-400 transition"
              />
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField("projects", i)}
                  className="text-red-600 hover:text-red-900 transition-colors duration-300"
                  title="Remove project"
                >
                  <Trash2 size={22} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </form>
  );
};

export default AcademicAndCertificationsForm;
