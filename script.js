const GAS_URL = "https://script.google.com/macros/s/AKfycbyIDReQLFwqF8WHQ9pNwoGljUKKrrm0yI6dlH3Eoi96yBKaj2ueUtqAggHIUzF5tsVR/exec"; // Ganti dengan URL Deploy Apps Script
const WA_GURU = "6282143534304";
const PIN_GURU = "321789";

let currentStudent = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft = 90 * 60; // 90 Menit dalam detik

// Struktur Soal yang Mudah Disesuaikan/Diperbarui untuk Ujian Berikutnya
const examData = [
  {
    id: 1,
    type: "pg", // Pilihan Ganda biasa
    question: "1. Perhatikan gambar telinga! Salah satu bagian telinga berfungsi memperkuat getaran suara dan meneruskannya ke telinga bagian dalam. Bagian yang dimaksud ditunjukkan nomor ...",
    options: ["A. (1)", "B. (2)", "C. (3)", "D. (4)"],
    key: "B"
  },
  {
    id: 2,
    type: "pg",
    question: "2. Astri mengalami gangguan kesehatan mata miopi. Upaya Astri agar dapat membaca buku dengan jelas pada jarak normal adalah ...",
    options: [
      "A. memakai kacamata berlensa silindris ketika mengikuti pelajaran",
      "B. menggunakan kacamata hitam ketika membaca di ruang kelas",
      "C. mengenakan kacamata berlensa cembung saat membaca",
      "D. mengenakan kacamata berlensa negatif saat membaca"
    ],
    key: "D"
  },
  {
    id: 5,
    type: "bs", // Benar / Salah
    question: "5. Tentukan Benar/Salah terkait metamorfosis hewan berikut: (1) Kecoak dan Belalang sembah metamorfosis tidak sempurna.",
    options: ["Benar", "Salah"],
    key: "Benar"
  }
  // Tambahkan soal berikutnya dengan format JSON serupa
];

// Anti-Kecurangan Ringan: Deteksi Pindah Tab
document.addEventListener("visibilitychange", () => {
  if (document.hidden && currentStudent) {
    alert("Peringatan: Anda terdeteksi meninggalkan layar ujian!");
  }
});

async function login() {
  const nisn = document.getElementById("nisn").value;
  const password = document.getElementById("password").value;

  if (localStorage.getItem(`exam_done_${nisn}`)) {
    alert("Anda sudah pernah mengikuti ujian ini!");
    return;
  }

  // Request verifikasi ke Apps Script
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({ action: "login", nisn, password })
    });
    const result = await res.json();

    if (result.status === "success") {
      currentStudent = result.siswa;
      startExam();
    } else {
      alert(result.message);
    }
  } catch (e) {
    alert("Gagal terhubung ke server.");
  }
}

function startExam() {
  document.getElementById("login-card").classList.add("hidden");
  document.getElementById("exam-card").classList.remove("hidden");
  document.getElementById("student-info").innerText = `${currentStudent.nama} (${currentStudent.kelas})`;

  startTimer();
  renderQuestion();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    document.getElementById("timer").innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitExam();
    }
  }, 1000);
}

function renderQuestion() {
  const q = examData[currentQuestionIndex];
  document.getElementById("question-number").innerText = `Soal No. ${currentQuestionIndex + 1} dari ${examData.length}`;
  document.getElementById("question-text").innerText = q.question;

  const optContainer = document.getElementById("options-container");
  optContainer.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = `w-full text-left p-3 border rounded-lg hover:bg-green-50 ${userAnswers[q.id] === opt ? 'bg-green-200 border-green-600' : ''}`;
    btn.innerText = opt;
    btn.onclick = () => {
      userAnswers[q.id] = opt;
      renderQuestion();
    };
    optContainer.appendChild(btn);
  });

  document.getElementById("prev-btn").disabled = currentQuestionIndex === 0;
  if (currentQuestionIndex === examData.length - 1) {
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("submit-btn").classList.remove("hidden");
  } else {
    document.getElementById("next-btn").classList.remove("hidden");
    document.getElementById("submit-btn").classList.add("hidden");
  }
}

function nextQuestion() {
  if (currentQuestionIndex < examData.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

async function confirmSubmit() {
  if (confirm("Apakah Anda yakin ingin menyelesaikan dan mengirim jawaban?")) {
    clearInterval(timerInterval);
    await submitExam();
  }
}

async function submitExam() {
  // Hitung Skor & Analisis
  let totalCorrect = 0;
  let detailAnalisis = [];

  examData.forEach(q => {
    let ans = userAnswers[q.id] || "";
    let isCorrect = ans.startsWith(q.key) || ans === q.key;
    if (isCorrect) totalCorrect++;
    detailAnalisis.push({ qId: q.id, answer: ans, isCorrect });
  });

  let finalScore = Math.round((totalCorrect / examData.length) * 100);

  // Kirim data ke GAS
  await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "submit",
      siswa: currentStudent,
      skor: finalScore,
      jawaban: detailAnalisis
    })
  });

  // Tanda bahwa siswa sudah mengikuti ujian (1x Akses)
  localStorage.setItem(`exam_done_${currentStudent.nisn}`, "true");

  // Tampilan Akhir & WA
  document.getElementById("exam-card").classList.add("hidden");
  document.getElementById("result-card").classList.remove("hidden");

  let textWA = `Assalamu'alaikum Pak Guru, saya *${currentStudent.nama}* (NISN: ${currentStudent.nisn}) telah selesai mengikuti TRYOUT TKA IPAS Paket 3. Skor saya: *${finalScore}*. Terima kasih!`;
  document.getElementById("wa-link").href = `https://wa.me/${WA_GURU}?text=${encodeURIComponent(textWA)}`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
