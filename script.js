const GAS_URL = "https://script.google.com/macros/s/AKfycbyIDReQLFwqF8WHQ9pNwoGljUKKrrm0yI6dlH3Eoi96yBKaj2ueUtqAggHIUzF5tsVR/exec"; 
const WA_GURU = "6282143534304";
const PIN_GURU = "321789";

let currentStudent = null;
let currentQuestionIndex = 0;
let userAnswers = {}; // Menyimpan jawaban siswa { idSoal: pilihanSiswa }
let timerInterval;
let timeLeft = 90 * 60; // 90 Menit

// Database 30 Soal Lengkap IPAS Paket 3 beserta Kunci Jawaban untuk Analisis Butir Soal
const examData = [
  { id: 1, type: "pg", question: "1. Perhatikan gambar telinga! Salah satu bagian telinga berfungsi memperkuat getaran suara dan meneruskannya ke telinga bagian dalam. Bagian yang dimaksud ditunjukkan nomor …", options: ["A. (1)", "B. (2)", "C. (3)", "D. (4)"], key: "B" },
  { id: 2, type: "pg", question: "2. Astri mengalami gangguan kesehatan mata miopi. Upaya Astri agar dapat membaca buku dengan jelas pada jarak normal adalah …", options: ["A. memakai kacamata berlensa silindris ketika mengikuti pelajaran", "B. menggunakan kacamata hitam ketika membaca di ruang kelas", "C. mengenakan kacamata berlensa cembung saat membaca", "D. mengenakan kacamata berlensa negatif saat membaca"], key: "D" },
  { id: 3, type: "pg", question: "3. Perhatikan kartu bagian-bagian mata dan fungsinya (J, K, L). Tentukan tanggapan Salwa yang benar! (Pilih opsi yang sesuai)", options: ["A. Penjelasan fungsi J menangkap bayangan", "B. Penjelasan fungsi K memberi warna pada mata", "C. Penjelasan fungsi L meneruskan rangsang ke otak", "D. Jawaban B dan C benar"], key: "D" }, // Disesuaikan untuk pilihan ganda standar di aplikasi
  { id: 4, type: "pg", question: "4. Jawablah teka-teki silang daur hidup hewan (Menurun: 1. nyamuk, 2. lebah/semut, Mendatar: 3. kutudaun). Jawaban yang tepat untuk nomor 1, 2, dan 3 adalah …", options: ["A. 1. nyamuk, 2. lebah, 3. kutudaun", "B. 1. kecoak, 2. lalat, 3. labalaba", "C. 1. tomcat, 2. rayap, 3. labalaba", "D. 1. nyamuk, 2. semut, 3. kupukupu"], key: "D" },
  { id: 5, type: "pg", question: "5. Perhatikan gambar metamorfosis hewan (1) Kecoak, (2) Belalang sembah, (3) Capung, (4) Lalat. Pernyataan yang benar adalah …", options: ["A. Hewan (1) dan (2) metamorfosis sempurna", "B. Hewan (1) dan (2) metamorfosis tidak sempurna", "C. Hewan (3) dan (4) tidak bermetamorfosis", "D. Semua pernyataan benar"], key: "B" },
  { id: 6, type: "pg", question: "6. Perhatikan sumber daya alam (I) Bambu, (II) Lidah buaya, (III) Sapi, (IV) Singkong. Pasangan SDA dan manfaatnya yang tepat adalah …", options: ["A. (I) dan (II)", "B. (I) dan (IV)", "C. (II) dan (III)", "D. (III) dan (IV)"], key: "D" },
  { id: 7, type: "pg", question: "7. Cara mengatasi pencemaran sungai akibat sampah: (1) Mengelola limbah rumah tangga, (2) Membangun tanggul, (3) Membuat perangkap sampah berkala. Pernyataan yang benar adalah …", options: ["A. 1 dan 2", "B. 2 dan 3", "C. 1 dan 3", "D. 1, 2, dan 3"], key: "C" },
  { id: 8, type: "pg", question: "8. Perilaku manusia yang dapat menyebabkan berkurangnya sumber air bersih ditunjukkan gambar …", options: ["A. (I) Menebang semua pohon tanpa menanam kembali", "B. (II) Memburu berbagai binatang", "C. (III) Mengolah tanah saat kering", "D. (IV) Memancing ikan di sungai"], key: "A" },
  { id: 9, type: "pg", question: "9. Perhatikan organ pernapasan (Q, R, S). Pernyataan yang benar terkait proses pernapasan adalah …", options: ["A. Q adalah tempat pertukaran gas", "B. Pengaturan suhu dan kelembapan terjadi pada bagian Q", "C. S adalah tempat pertukaran oksigen dan karbon dioksida", "D. Jawaban B benar"], key: "B" },
  { id: 10, type: "pg", question: "10. Perhatikan gambar organ pencernaan. Penyerapan nutrisi karbohidrat, protein, vitamin, dan mineral oleh darah terjadi pada bagian bertanda huruf …", options: ["A. P", "B. Q", "C. R", "D. S"], key: "D" },
  { id: 11, type: "pg", question: "11. Poster gangguan pencernaan dan cara mencegahnya yang tepat ditunjukkan oleh nomor …", options: ["A. (I) dan (II)", "B. (I) dan (IV)", "C. (II) dan (III)", "D. (III) dan (IV)"], key: "C" },
  { id: 12, type: "pg", question: "12. Perhatikan diagram sistem peredaran darah Dayu. Kesalahan pada diagram tersebut adalah …", options: ["A. Keterangan I nomor 1 salah", "B. Keterangan II nomor 2 salah", "C. Keterangan III nomor 1 menyalurkan darah kaya oksigen dari seluruh tubuh", "D. Keterangan III nomor 1 seharusnya menyalurkan darah kaya karbondioksida dari seluruh tubuh"], key: "D" },
  { id: 13, type: "pg", question: "13. Gejala pusing, mudah lelah, napas pendek, kuku pucat, jantung berdebar (Anemia). Upaya pencegahan yang benar adalah …", options: ["A. Mengonsumsi olahan daging segar dan sayur kaya zat besi", "B. Menghindari vitamin B12", "C. Mengonsumsi makanan kemasan", "D. Tidak perlu dicegah"], key: "A" },
  { id: 14, type: "pg", question: "14. Otot yang bekerja secara sadar, mudah lelah, dan kontraksi cepat terdapat pada bagian tubuh …", options: ["A. usus dan jantung", "B. lambung dan lengan", "C. lambung dan usus", "D. punggung dan paha"], key: "D" },
  { id: 15, type: "pg", question: "15. Perhatikan gambar sendi (K, L, M). Pilihan nama dan arah gerak sendi yang benar adalah …", options: ["A. K adalah sendi putar", "B. L adalah sendi peluru dan M adalah sendi engsel", "C. M adalah sendi putar", "D. K adalah sendi pelana"], key: "B" },
  { id: 16, type: "pg", question: "16. Rantai makanan: makhluk hidup yang dapat berperan sebagai konsumen tingkat 3 ditunjukkan nomor …", options: ["A. (1), (2), dan (4)", "B. (2), (3), dan (4)", "C. (2), (3), dan (6)", "D. (3), (5), dan (6)"], key: "C" },
  { id: 17, type: "pg", question: "17. Simbiosis yang berbeda dengan interaksi mutualisme pada gambar P (lebah dan bunga) ditunjukkan oleh gambar huruf …", options: ["A. K, M, dan N", "B. K, L, dan N", "C. L, M, dan O", "D. K, N, dan O"], key: "C" },
  { id: 18, type: "pg", question: "18. Adaptasi hewan (1) Elang, (2) Burung hantu, (3) Bebek. Pernyataan yang benar adalah …", options: ["A. Elang berparuh runcing untuk mencabik mangsa", "B. Bebek tidak memiliki kaki berselaput", "C. Burung hantu tidak memiliki cakar", "D. Semua salah"], key: "A" },
  { id: 19, type: "pg", question: "19. Tumbuhan yang memiliki kesamaan cara beradaptasi dengan mawar (X) dalam melindungi diri (memiliki duri) adalah …", options: ["A. (I), (II) dan (III)", "B. (I), (II) dan (IV)", "C. (I), (III) dan (IV)", "D. (II), (III) dan (IV)"], key: "B" },
  { id: 20, type: "pg", question: "20. Penjelasan perubahan wujud yang benar adalah …", options: ["A. Mencair terjadi pada gambar (1)", "B. Mencair terjadi pada gambar (2) (padat menjadi cair)", "C. Mengembun terjadi pada gambar (3)", "D. Mengembun terjadi pada gambar (4) benda padat"], key: "B" },
  { id: 21, type: "pg", question: "21. Bagan perubahan wujud: peristiwa yang sesuai dengan nomor 1 (menyublim), 2 (menguap/mengembun), dan 3 (mencair/membeku) adalah …", options: ["A. Nomor 1 saja", "B. Nomor 1 dan 2", "C. Nomor 1, 2, dan 3", "D. Nomor 3 saja"], key: "C" },
  { id: 22, type: "pg", question: "22. Berdasarkan infografis (angin lemah, sungai kering, panas bumi lemah, matahari cerah sepanjang tahun), energi alternatif untuk pembangkit listrik adalah …", options: ["A. PLTPB", "B. PLTA", "C. PLTS", "D. PLTN"], key: "C" },
  { id: 23, type: "pg", question: "23. Peralatan listrik yang memiliki kesamaan perubahan energi (listrik ke gerak) dengan bor listrik adalah …", options: ["A. Andi (Kipas angin) dan Budi (Setrika)", "B. Budi dan Candra", "C. Candra dan Deni", "D. Andi dan Deni (Kipas angin dan Mesin cuci)"], key: "D" },
  { id: 24, type: "pg", question: "24. Gaya pada kegiatan menyetrika baju: (1) Gaya otot pada lengan, (2) Gaya gesek pada alas setrika, (3) Gaya listrik statis. Pernyataan yang benar adalah …", options: ["A. 1, 2, dan 3 benar", "B. 1 dan 2 benar", "C. 2 dan 3 benar", "D. 1 dan 3 benar"], key: "B" },
  { id: 25, type: "pg", question: "25. Pengaruh gaya terhadap benda pada gambar (1, 2, 3, 4) yang tepat adalah …", options: ["A. Gambar 1 benda diam jadi bergerak", "B. Gambar 3 gaya mengubah bentuk benda, gambar 4 benda bergerak menjadi diam", "C. Gambar 2 mengubah bentuk", "D. Jawaban B benar"], key: "B" },
  { id: 26, type: "pg", question: "26. Alat musik Gamelan (bilah P, Q, R, S). Tinggi rendah bunyi yang dihasilkan: bilah makin besar makin rendah nadanya. Pernyataan yang benar adalah …", options: ["A. S adalah nada tertinggi", "B. S bernada terendah dan Q lebih tinggi dari R", "C. P bernada terendah", "D. Semua sama"], key: "B" },
  { id: 27, type: "pg", question: "27. Sifat-sifat cahaya berdasarkan gambar (1 cermin, 2 bayangan pohon, 3 kaca pembesar). Pernyataan yang benar adalah …", options: ["A. Gambar 1 cahaya menembus benda", "B. Gambar 2 cahaya merambat lurus dan gambar 3 cahaya dibiaskan", "C. Gambar 1 menunjukkan pembiasan", "D. Semua salah"], key: "B" },
  { id: 28, type: "pg", question: "28. Potongan tata surya: planet dengan kala revolusi terlama nomor 4. Planet nomor 1, 2, dan 3 secara berturut-turut adalah …", options: ["A. Venus, Bumi, Mars", "B. Bumi, Mars, Jupiter", "C. Mars, Jupiter, Saturnus", "D. Jupiter, Saturnus, Uranus"], key: "A" },
  { id: 29, type: "pg", question: "29. Akibat rotasi Bumi ditunjukkan oleh nomor … (1. Perbedaan waktu WIB/WIT, 2. Gerak semu harian matahari, 3. Pergeseran titik terbit matahari).", options: ["A. 1 dan 2", "B. 2 dan 3", "C. 1 dan 3", "D. 1, 2, dan 3"], key: "A" },
  { id: 30, type: "pg", question: "30. Gambar peristiwa gerhana Bulan sebagian dan gerhana Matahari cincin berturut-turut ditunjukkan nomor …", options: ["A. (w) dan (x)", "B. (w) dan (z)", "C. (x) dan (y)", "D. (y) dan (z)"], key: "D" }
];

// Navigasi Login Guru / Siswa
function toggleTeacherLogin() {
  document.getElementById("login-card").classList.add("hidden");
  document.getElementById("teacher-login-card").classList.remove("hidden");
}

function toggleStudentLogin() {
  document.getElementById("teacher-login-card").classList.add("hidden");
  document.getElementById("login-card").classList.remove("hidden");
}

function loginGuru() {
  const pinInput = document.getElementById("teacher-pin").value;
  if (pinInput === PIN_GURU) {
    document.getElementById("teacher-login-card").classList.add("hidden");
    document.getElementById("teacher-dashboard").classList.remove("hidden");
    document.getElementById("teacher-pin").value = "";
  } else {
    alert("PIN Guru salah!");
  }
}

function logoutGuru() {
  document.getElementById("teacher-dashboard").classList.add("hidden");
  document.getElementById("login-card").classList.remove("hidden");
}

function resetSiswa() {
  const nisnReset = document.getElementById("reset-nisn").value.trim();
  if (!nisnReset) {
    alert("Masukkan NISN siswa terlebih dahulu!");
    return;
  }
  localStorage.removeItem(`exam_done_${nisnReset}`);
  alert(`Status ujian untuk NISN ${nisnReset} berhasil di-reset!`);
  document.getElementById("reset-nisn").value = "";
}

async function loginSiswa() {
  const nisn = document.getElementById("nisn").value;
  const password = document.getElementById("password").value;

  if (localStorage.getItem(`exam_done_${nisn}`)) {
    alert("Anda sudah pernah mengikuti ujian ini!");
    return;
  }

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

  renderQuestionPalette();
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

// Render Palette Nomor Soal untuk Loncat Soal & Indikator Warna
function renderQuestionPalette() {
  const paletteContainer = document.getElementById("question-palette");
  paletteContainer.innerHTML = "";

  examData.forEach((q, idx) => {
    const btn = document.createElement("button");
    let isAnswered = userAnswers[q.id] !== undefined;
    let isCurrent = currentQuestionIndex === idx;

    // Warna Indikator: Hijau (sudah dijawab), Putih/Abu (belum), Border Biru tebal (sedang aktif)
    let btnClass = "w-9 h-9 text-xs font-bold rounded border flex items-center justify-center transition ";
    if (isCurrent) {
      btnClass += "bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300";
    } else if (isAnswered) {
      btnClass += "bg-green-500 text-white border-green-600";
    } else {
      btnClass += "bg-white text-gray-700 border-gray-300 hover:bg-gray-100";
    }

    btn.className = btnClass;
    btn.innerText = idx + 1;
    btn.onclick = () => {
      currentQuestionIndex = idx;
      renderQuestion();
      renderQuestionPalette();
    };
    paletteContainer.appendChild(btn);
  });
}

function renderQuestion() {
  const q = examData[currentQuestionIndex];
  document.getElementById("question-number").innerText = `Soal No. ${currentQuestionIndex + 1} dari ${examData.length}`;
  document.getElementById("question-text").innerHTML = q.question;

  const optContainer = document.getElementById("options-container");
  optContainer.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    let isSelected = userAnswers[q.id] === opt;
    btn.className = `w-full text-left p-3 border rounded-lg transition ${isSelected ? 'bg-green-100 border-green-600 font-semibold' : 'hover:bg-green-50 bg-white'}`;
    btn.innerText = opt;
    btn.onclick = () => {
      userAnswers[q.id] = opt;
      renderQuestion();
      renderQuestionPalette(); // Update warna indikator palette
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
    renderQuestionPalette();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
    renderQuestionPalette();
  }
}

async function confirmSubmit() {
  if (confirm("Apakah Anda yakin ingin menyelesaikan dan mengirim jawaban?")) {
    clearInterval(timerInterval);
    await submitExam();
  }
}

async function submitExam() {
  let totalCorrect = 0;
  let detailAnalisis = [];

  examData.forEach(q => {
    let ans = userAnswers[q.id] || "";
    let isCorrect = ans.startsWith(q.key) || ans === q.key;
    if (isCorrect) totalCorrect++;
    detailAnalisis.push({ qId: q.id, answer: ans, isCorrect });
  });

  let finalScore = Math.round((totalCorrect / examData.length) * 100);

  try {
    await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submit",
        siswa: currentStudent,
        skor: finalScore,
        jawaban: detailAnalisis
      })
    });
  } catch (e) {
    console.log("Pengiriman data latar belakang selesai.");
  }

  localStorage.setItem(`exam_done_${currentStudent.nisn}`, "true");

  document.getElementById("exam-card").classList.add("hidden");
  document.getElementById("result-card").classList.remove("hidden");

  let textWA = `Assalamu'alaikum Pak Guru, saya *${currentStudent.nama}* (NISN: ${currentStudent.nisn}) telah selesai mengikuti TRYOUT TKA IPAS Paket 3. Skor saya: *${finalScore}*. Terima kasih!`;
  document.getElementById("wa-link").href = `https://wa.me/${WA_GURU}?text=${encodeURIComponent(textWA)}`;
}
