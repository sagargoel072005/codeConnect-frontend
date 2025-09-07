import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FileText, Download, Loader2 } from "lucide-react";
import { Document, PDFDownloadLink, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { BASE_URL } from "../utils/constants";

const AIResumeBuilder = () => {
  const user = useSelector((store) => store.user);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/generate-resume`, {
        name: `${(user.firstName || "")} ${(user.lastName || "")}`.trim(),
        about: user.about || "",
        skills: Array.isArray(user.skills) && user.skills.length > 0 ? user.skills : ["JavaScript", "React"],
        projects: Array.isArray(user.projects) ? user.projects : [],
        education: Array.isArray(user.academicQualifications)
          ? user.academicQualifications
          : user.academicQualifications
          ? [user.academicQualifications]
          : [],
        certifications: Array.isArray(user.certifications) ? user.certifications : [],
        experience: [],
      });
      setResume(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate resume");
    } finally {
      setLoading(false);
    }
  };

  // ---------- PDF Styles ----------
  const styles = StyleSheet.create({
    page: { padding: 35, fontFamily: "Helvetica", fontSize: 11, color: "#222", lineHeight: 1.5 },
    headerName: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#111", marginBottom: 4 },
    headerContacts: { flexDirection: "row", justifyContent: "center", fontSize: 10, color: "#2563eb", marginBottom: 20 },
    contactLink: { marginHorizontal: 6, textDecoration: "none", color: "#2563eb" },
    section: { marginBottom: 14 },
    sectionHeader: { fontSize: 13, fontWeight: "bold", color: "#2563eb", borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 6 },
    bulletLine: { flexDirection: "row", alignItems: "flex-start", marginBottom: 3 },
    bullet: { width: 10, fontSize: 12, color: "#2563eb" },
    bulletText: { flex: 1 },
    skillWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  skillItem: { width: "33%", marginBottom: 4 }
  });

  // ---------- PDF Template ----------
  const MyResumePDF = ({ user, resume }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.headerName}>{user.firstName} {user.lastName}</Text>
        <View style={styles.headerContacts}>
          <Text>{user.emailId}</Text>
          {user.githubProfileUrl && <Link src={user.githubProfileUrl} style={styles.contactLink}>GitHub</Link>}
          {user.linkedIn && <Link src={user.linkedIn} style={styles.contactLink}>LinkedIn</Link>}
          {user.leetcodeId && <Link src={user.leetcodeId} style={styles.contactLink}>LeetCode</Link>}
        </View>

        {/* Objective */}
        {resume?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Objective</Text>
            <Text>{resume.summary}</Text>
          </View>
        )}

{user.academicQualifications && Object.values(user.academicQualifications).length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionHeader}>Education</Text>
    {Object.values(user.academicQualifications)
      .filter(ed => ed && (ed.degree || ed.school))
      .map((ed, i) => (
        <View key={i} style={styles.bulletLine}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: "bold" }}>{ed.degree || ed.school}</Text>
            {ed.institution ? ` ${ed.institution}` : ""}
            {ed.percentage ? ` (${ed.percentage}%)` : ed.sgpa ? ` (${ed.sgpa} SGPA)` : ""}
          </Text>
        </View>
      ))}
  </View>
)}

        {/* Skills */}
        {resume?.skillsBullets?.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionHeader}>Skills</Text>
    <View style={styles.skillWrap}>
      {resume.skillsBullets.map((s, i) => (
        <Text key={i} style={styles.skillItem}>• {s}</Text>
      ))}
    </View>
  </View>
)}

        {/* Experience */}
        {resume?.experienceBullets?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Experience</Text>
            {resume.experienceBullets.map((e, i) => (
              <View key={i} style={styles.bulletLine}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{e}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {user.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Projects</Text>
            {user.projects.map((p, i) => (
              <View key={i} style={styles.bulletLine}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {user.certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Certifications</Text>
            {user.certifications.map((c, i) => (
              <View key={i} style={styles.bulletLine}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Profile Header Preview */}
      <div className="flex flex-col items-center text-center mb-6">
        <img src={user.photoUrl} alt="profile" className="w-24 h-24 rounded-full border-4 border-blue-600 shadow-lg mb-4" />
        <h1 className="text-3xl font-bold uppercase">{user.firstName} {user.lastName}</h1>
        <p className="text-gray-600">{user.emailId}</p>
        <div className="flex gap-4 mt-2 text-blue-600 font-semibold">
          {user.githubProfileUrl && <a href={user.githubProfileUrl} target="_blank">GitHub</a>}
          {user.linkedIn && <a href={user.linkedIn} target="_blank">LinkedIn</a>}
          {user.leetcodeId && <a href={user.leetcodeId} target="_blank">LeetCode</a>}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-800"
      >
        {loading ? <Loader2 className="animate-spin" /> : <FileText />}
        {loading ? "Generating Resume..." : "Generate Resume"}
      </button>

      {resume && (
        <div className="mt-8 space-y-6">
          {/* Summary */}
          {resume.summary && (
            <div>
              <h2 className="text-xl font-bold text-blue-700 border-b pb-1 mb-2">Summary</h2>
              <p>{resume.summary}</p>
            </div>
          )}

          {/* Skills */}
          {resume.skillsBullets?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-700 border-b pb-1 mb-2">Skills</h2>
              <ul className="grid grid-cols-2 gap-2">
                {resume.skillsBullets.map((s, i) => (
                  <li key={i} className="bg-gray-100 p-2 rounded">{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience */}
          {resume.experienceBullets?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-700 border-b pb-1 mb-2">Experience</h2>
              <ul className="list-disc list-inside">
                {resume.experienceBullets.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          {/* Education */}
          {user.academicQualifications?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-700 border-b pb-1 mb-2">Education</h2>
              <ul className="list-disc list-inside">
                {user.academicQualifications.map((ed, i) => (
                  <li key={i}>
                    <strong>{ed.degree || ed.school}</strong>
                    {ed.institution ? ` – ${ed.institution}` : ""}
                    {ed.percentage ? ` (${ed.percentage}%)` : ed.sgpa ? ` (${ed.sgpa} SGPA)` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Projects */}
          {user.projects?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-700 border-b pb-1 mb-2">Projects</h2>
              <ul className="list-disc list-inside">
                {user.projects.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {user.certifications?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-blue-700 border-b pb-1 mb-2">Certifications</h2>
              <ul className="list-disc list-inside">
                {user.certifications.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          {/* Download PDF */}
          <PDFDownloadLink
            document={<MyResumePDF user={user} resume={resume} />}
            fileName={`${user.firstName}_${user.lastName}_resume.pdf`}
            className="inline-flex mt-4 px-5 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 items-center gap-2 font-semibold"
          >
            <Download /> Download PDF
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default AIResumeBuilder;
