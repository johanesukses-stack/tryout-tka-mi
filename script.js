/**
 * APLIKASI UJIAN ONLINE - TRYOUT TKA MI HUSNAYAIN SLEMAN
 * Mapel: IPAS Paket 3
 */

const GAS_URL = "https://script.google.com/macros/s/AKfycbyIDReQLFwqF8WHQ9pNwoGljUKKrrm0yI6dlH3Eoi96yBKaj2ueUtqAggHIUzF5tsVR/exec"; // Ganti dengan URL Deploy Web App Apps Script Anda
const WA_GURU = "6282143534304";
const PIN_GURU = "321789";

let currentStudent = null;
let currentQuestionIndex = 0;
let userAnswers = {}; // Menyimpan jawaban siswa { idSoal: "A/B/C/D" }
let timerInterval;
let timeLeft = 90 * 60; // 90 Menit dalam detik

// Database 30 Soal Lengkap IPAS Paket 3 + Tag Gambar + Kunci Jawaban
const examData = [
  {
    id: 1,
    type: "pg",
    question: "1. Perhatikan gambar berikut!<br><img src='images/soal1_telinga.png' alt='Gambar Telinga' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Salah satu bagian telinga berfungsi memperkuat getaran suara dan meneruskannya ke telinga bagian dalam. Bagian yang dimaksud ditunjukkan nomor …",
    options: ["A. (1)", "B. (2)", "C. (3)", "D. (4)"],
    key: "B"
  },
  {
    id: 2,
    type: "pg",
    question: "2. Astri mengalami gangguan kesehatan mata. Astri tidak dapat membaca buku bacaan dengan jelas pada jarak 30 cm. Tulisan dapat dibaca dengan jelas jika buku didekatkan ke mata. Setelah diperiksakan, dokter mata mengatakan jika Astri mengalami gangguan mata miopi. Upaya Astri agar dapat membaca buku dengan jelas pada jarak normal adalah …",
    options: [
      "A. memakai kacamata berlensa silindris ketika mengikuti pelajaran",
      "B. menggunakan kacamata hitam ketika membaca di ruang kelas",
      "C. mengenakan kacamata berlensa cembung saat membaca",
      "D. mengenakan kacamata berlensa negatif saat membaca"
    ],
    key: "D"
  },
  {
    id: 3,
    type: "pg",
    question: "3. Cintya membuat kartu bagian-bagian mata dan fungsinya seperti pada gambar berikut.<br><img src='images/soal3_mata.png' alt='Bagian Mata' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Cintya meminta Salwa untuk memberikan tanggapan mengenai kartu yang dibuatnya. Tanggapan Salwa yang benar terhadap kartu Cintya tersebut adalah …",
    options: [
      "A. Penjelasan fungsi J seharusnya menangkap bayangan",
      "B. Penjelasan fungsi K seharusnya memberi warna pada mata",
      "C. Penjelasan fungsi L seharusnya meneruskan rangsang ke otak",
      "D. Penjelasan fungsi K (memberi warna) dan L (meneruskan rangsang ke otak) adalah benar"
    ],
    key: "D"
  },
  {
    id: 4,
    type: "pg",
    question: "4. Jawablah teka-teki silang berikut! Jawaban pada teka-teki silang ini adalah nama-nama hewan yang memiliki kesamaan tahapan daur hidup seperti gambar.<br><img src='images/soal4_tts.png' alt='Teka Teki Silang Daur Hidup' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Jawaban yang tepat untuk nomor 1, 2, dan 3 adalah …",
    options: [
      "A. 1. nyamuk, 2. lebah, 3. kutudaun",
      "B. 1. kecoak, 2. lalat, 3. labalaba",
      "C. 1. tomcat, 2. rayap, 3. labalaba",
      "D. 1. nyamuk, 2. semut, 3. kupukupu"
    ],
    key: "D"
  },
  {
    id: 5,
    type: "pg",
    question: "5. Perhatikan gambar hewan berikut!<br><img src='images/soal5_metamorfosis.png' alt='Metamorfosis Hewan' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Hewan-hewan tersebut mengalami metamorfosis yang beragam. Pernyataan yang BENAR terkait metamorfosis hewan tersebut adalah …",
    options: [
      "A. Hewan nomor (1) Kecoak dan (2) Belalang Sembah mengalami metamorfosis tidak sempurna",
      "B. Hewan nomor (2) dan (3) mengalami tahap pupa",
      "C. Hewan nomor (3) dan (4) sama-sama tidak mengalami metamorfosis",
      "D. Hewan nomor (1) dan (4) metamorfosis sempurna"
    ],
    key: "A"
  },
  {
    id: 6,
    type: "pg",
    question: "6. Perhatikan gambar berikut!<br><img src='images/soal6_sda.png' alt='Sumber Daya Alam' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Pasangan yang tepat antara sumber daya alam dengan manfaatnya ditunjukkan oleh gambar nomor …",
    options: ["A. (I) dan (II)", "B. (I) dan (IV)", "C. (II) dan (III)", "D. (III) dan (IV)"],
    key: "D"
  },
  {
    id: 7,
    type: "pg",
    question: "7. Perhatikan ilustrasi sungai yang tercemar sampah berikut!<br><img src='images/soal7_sungai.png' alt='Pencemaran Sungai' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Manakah kombinasi langkah yang benar untuk mengatasi pencemaran sungai tersebut?",
    options: [
      "A. Mengelola limbah rumah tangga & Membuat perangkap sampah secara berkala",
      "B. Membangun tanggul tinggi di sepanjang aliran sungai saja",
      "C. Menutup aliran sungai agar air tidak mengalir",
      "D. Mengalirkan limbah ke kolam penampungan terbuka"
    ],
    key: "A"
  },
  {
    id: 8,
    type: "pg",
    question: "8. Air merupakan salah satu kebutuhan pokok makhluk hidup. Beberapa perilaku manusia tampak seperti gambar berikut.<br><img src='images/soal8_air.png' alt='Perilaku Manusia' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Perilaku manusia yang dapat menyebabkan berkurangnya sumber air bersih ditunjukkan gambar …",
    options: ["A. (I)", "B. (II)", "C. (III)", "D. (IV)"],
    key: "A"
  },
  {
    id: 9,
    type: "pg",
    question: "9. Perhatikan gambar organ pernapasan berikut!<br><img src='images/soal9_pernapasan.png' alt='Organ Pernapasan' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Pernyataan yang BENAR terkait proses pernapasan pada bagian yang ditunjuk huruf Q, R, dan S adalah …",
    options: [
      "A. Pengaturan suhu dan kelembapan udara terjadi pada bagian Q (rongga hidung)",
      "B. Pertukaran gas oksigen terjadi pada bagian S (bronkus)",
      "C. Bagian R merupakan tempat penyerapan air",
      "D. Bagian Q merupakan tempat penyaringan darah"
    ],
    key: "A"
  },
  {
    id: 10,
    type: "pg",
    question: "10. Perhatikan gambar organ pencernaan berikut ini!<br><img src='images/soal10_pencernaan.png' alt='Organ Pencernaan' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Proses penyerapan nutrisi karbohidrat, protein, vitamin, dan mineral oleh darah terjadi pada bagian bertanda huruf …",
    options: ["A. P", "B. Q", "C. R", "D. S"],
    key: "D"
  },
  {
    id: 11,
    type: "pg",
    question: "11. Siswa kelas VI mendapat tugas membuat poster tentang gangguan pencernaan dan cara mencegahnya. Beberapa poster tampak seperti gambar berikut.<br><img src='images/soal11_poster_pencernaan.png' alt='Poster Pencernaan' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Poster yang tepat tentang gangguan pencernaan dan cara mencegahnya ditunjukkan oleh gambar nomor …",
    options: ["A. (I) dan (II)", "B. (I) dan (IV)", "C. (II) dan (III)", "D. (III) dan (IV)"],
    key: "C"
  },
  {
    id: 12,
    type: "pg",
    question: "12. Dayu membuat diagram sistem peredaran darah seperti gambar berikut.<br><img src='images/soal12_peredaran_darah.png' alt='Peredaran Darah' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Kesalahan dari diagram buatan Dayu dan penjelasan yang tepat adalah …",
    options: [
      "A. Keterangan II nomor 1 seharusnya menyalurkan darah miskin oksigen ke seluruh tubuh",
      "B. Keterangan I nomor 2 seharusnya aliran darah cepat dan memancar ketika terluka",
      "C. Keterangan II nomor 3 seharusnya dinding pembuluh darah tipis dan memiliki katup",
      "D. Keterangan III nomor 1 seharusnya menyalurkan darah kaya karbondioksida dari seluruh tubuh kembali ke jantung"
    ],
    key: "D"
  },
  {
    id: 13,
    type: "pg",
    question: "13. Perhatikan poster gejala gangguan kesehatan berikut!<br><img src='images/soal13_anemia.png' alt='Gejala Anemia' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Langkah pencegahan yang paling tepat untuk menghindari gangguan kesehatan (anemia) berdasarkan gejala tersebut adalah …",
    options: [
      "A. Mengonsumsi olahan daging segar serta makan sayuran tinggi zat besi seperti bayam dan brokoli",
      "B. Menghindari makanan sumber vitamin B12 seperti ikan laut dan telur",
      "C. Memperbanyak konsumsi makanan tinggi lemak dan minyak",
      "D. Mengurangi konsumsi air putih dan istirahat"
    ],
    key: "A"
  },
  {
    id: 14,
    type: "pg",
    question: "14. Otot adalah jaringan pada tubuh manusia yang dapat berkontraksi dan relaksasi. Berikut gambar dan ciri salah satu jenis otot:<br><img src='images/soal14_otot.png' alt='Otot Rangka' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Ciri: 1. Bekerja secara sadar, 2. Mudah lelah, 3. Kontraksi cepat.<br>Bagian tubuh yang memiliki jenis otot sesuai ciri tersebut adalah …",
    options: ["A. usus dan jantung", "B. lambung dan lengan", "C. lambung dan usus", "D. punggung dan paha"],
    key: "D"
  },
  {
    id: 15,
    type: "pg",
    question: "15. Perhatikan gambar rangka dan sendi berikut!<br><img src='images/soal15_sendi.png' alt='Sendi Rangka' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Pilihan nama dan arah gerak sendi yang BENAR sesuai gambar yang ditunjuk adalah …",
    options: [
      "A. K merupakan sendi putar dua arah",
      "B. L merupakan sendi peluru (ke segala arah) dan M merupakan sendi engsel (satu arah)",
      "C. L merupakan sendi pelana dan M merupakan sendi putar",
      "D. K dan L sama-sama merupakan sendi kaku"
    ],
    key: "B"
  },
  {
    id: 16,
    type: "pg",
    question: "16. Perhatikan gambar makhluk hidup berikut!<br><img src='images/soal16_rantai_makanan.png' alt='Rantai Makanan' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Makhluk hidup tersebut dapat membentuk rantai makanan. Makhluk hidup yang dapat berperan sebagai konsumen tingkat 3 ditunjukkan nomor …",
    options: ["A. (1), (2), dan (4)", "B. (2), (3), dan (4)", "C. (2), (3), dan (6)", "D. (3), (5), dan (6)"],
    key: "C"
  },
  {
    id: 17,
    type: "pg",
    question: "17. Perhatikan beberapa gambar simbiosis berikut!<br><img src='images/soal17_simbiosis.png' alt='Simbiosis' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Gambar P menunjukkan simbiosis mutualisme. Simbiosis yang BERBEDA (bukan mutualisme) ditunjukkan oleh gambar pada huruf …",
    options: ["A. K, M, dan N", "B. K, L, dan N", "C. L, M, dan O", "D. K, N, dan O"],
    key: "C"
  },
  {
    id: 18,
    type: "pg",
    question: "18. Perhatikan gambar burung berikut!<br><img src='images/soal18_adaptasi_hewan.png' alt='Adaptasi Burung' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Pernyataan yang BENAR terkait cara adaptasi hewan tersebut adalah …",
    options: [
      "A. Hewan (1) mempunyai paruh runcing, kuat, dan tajam untuk mencabik mangsa, serta hewan (3) memiliki kaki berselaput untuk berenang",
      "B. Hewan (1), (2), dan (3) semuanya mempunyai cakar tajam mencengkeram",
      "C. Hewan (2) memiliki kaki berselaput untuk memudahkan berenang",
      "D. Hewan (3) memiliki paruh tajam untuk mencabik daging"
    ],
    key: "A"
  },
  {
    id: 19,
    type: "pg",
    question: "19. Perhatikan gambar beberapa tumbuhan berikut!<br><img src='images/soal19_adaptasi_tumbuhan.png' alt='Adaptasi Tumbuhan' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Tumbuhan yang memiliki kesamaan cara beradaptasi dengan mawar (X) dalam rangka melindungi diri (memiliki duri) adalah …",
    options: ["A. (I), (II) dan (III)", "B. (I), (II) dan (IV)", "C. (I), (III) dan (IV)", "D. (II), (III) dan (IV)"],
    key: "B"
  },
  {
    id: 20,
    type: "pg",
    question: "20. Perhatikan beberapa gambar tentang peristiwa perubahan wujud berikut.<br><img src='images/soal20_perubahan_wujud.png' alt='Perubahan Wujud' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Penjelasan yang benar tentang perubahan wujud pada gambar yang ditunjuk adalah …",
    options: [
      "A. mencair terjadi pada gambar (1) yaitu benda gas menjadi cair",
      "B. mencair terjadi pada gambar (2) yaitu benda padat menjadi cair",
      "C. mengembun terjadi pada gambar (3) yaitu benda gas menjadi cair",
      "D. mengembun terjadi pada gambar (4) yaitu benda padat menjadi cair"
    ],
    key: "B"
  },
  {
    id: 21,
    type: "pg",
    question: "21. Perhatikan bagan perubahan wujud berikut!<br><img src='images/soal21_bagan_wujud.png' alt='Bagan Perubahan Wujud' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Pernyataan yang sesuai dengan bagan perubahan wujud (1=padat-gas, 2=cair-gas, 3=padat-cair) adalah …",
    options: [
      "A. Terjadinya jelaga pada dinding knalpot merupakan contoh nomor 1",
      "B. Evaporasi pada daur air merupakan contoh nomor 2",
      "C. Melekatnya cairan malam pada kain saat membatik merupakan contoh nomor 3",
      "D. Semua pernyataan (A, B, dan C) adalah benar"
    ],
    key: "D"
  },
  {
    id: 22,
    type: "pg",
    question: "22. Perhatikan infografis wilayah berikut!<br><img src='images/soal22_energi.png' alt='Infografis Energi' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Berdasarkan infografis tersebut, penggunaan energi alternatif yang tepat untuk pembangkit listrik di wilayah tersebut adalah …",
    options: [
      "A. Pembangkit Listrik Tenaga Panas Bumi (PLTPB)",
      "B. Pembangkit Listrik Tenaga Air (PLTA)",
      "C. Pembangkit Listrik Tenaga Surya (PLTS)",
      "D. Pembangkit Listrik Tenaga Nuklir (PLTN)"
    ],
    key: "C"
  },
  {
    id: 23,
    type: "pg",
    question: "23. Bu Ani memperlihatkan gambar bor listrik. Peralatan yang memiliki kesamaan perubahan energi (listrik menjadi gerak) dengan bor listrik adalah kartu milik …<br><img src='images/soal23_perubahan_energi.png' alt='Kartu Perubahan Energi' class='my-3 max-h-48 mx-auto rounded border shadow-sm'>",
    options: ["A. Andi dan Budi", "B. Budi dan Candra", "C. Candra dan Deni", "D. Andi dan Deni"],
    key: "D"
  },
  {
    id: 24,
    type: "pg",
    question: "24. Ibu sedang melakukan pekerjaan rumah menyetrika seperti gambar berikut.<br><img src='images/soal24_setrika.png' alt='Gaya Menyetrika' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Pernyataan yang BENAR mengenai gaya yang bekerja pada kegiatan tersebut adalah …",
    options: [
      "A. Gaya otot bekerja pada bagian A dan Gaya gesek bekerja pada bagian B saat setrika digerakkan",
      "B. Gaya listrik statis bekerja pada bagian C saat setrika dialiri listrik",
      "C. Gaya pegas bekerja pada bagian A saat tangan menggosok",
      "D. Gaya magnet bekerja pada bagian B"
    ],
    key: "A"
  },
  {
    id: 25,
    type: "pg",
    question: "25. Gaya dalam kehidupan sehari-hari tampak pada gambar berikut.<br><img src='images/soal25_gaya.png' alt='Pengaruh Gaya' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Penjelasan pengaruh gaya yang sesuai dengan kegiatan pada gambar adalah …",
    options: [
      "A. Gambar (1) gaya membuat benda diam menjadi bergerak",
      "B. Gambar (2) gaya mengubah bentuk benda",
      "C. Gambar (3) gaya menghentikan benda bergerak",
      "D. Gambar (3) gaya mengubah bentuk benda, sedangkan gambar (4) gaya membuat benda bergerak menjadi diam"
    ],
    key: "D"
  },
  {
    id: 26,
    type: "pg",
    question: "26. Perhatikan alat musik gamelan berikut!<br><img src='images/soal26_gamelan.png' alt='Alat Musik Gamelan' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Alat musik dipukul dengan cara sama. Pernyataan yang BENAR mengenai tinggi rendah bunyi bilah (Makin besar bilah, nada makin rendah) adalah …",
    options: [
      "A. Bunyi dengan nada terendah dihasilkan oleh bilah bertanda huruf S",
      "B. Bilah Q menghasilkan bunyi dengan nada lebih tinggi daripada bilah R dan S",
      "C. Bilah P menghasilkan nada lebih tinggi dari bilah Q",
      "D. Pernyataan A, B, dan C semuanya benar"
    ],
    key: "D"
  },
  {
    id: 27,
    type: "pg",
    question: "27. Perhatikan gambar sifat-sifat cahaya berikut!<br><img src='images/soal27_cahaya.png' alt='Sifat Cahaya' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Pernyataan yang BENAR terkait sifat-sifat cahaya berdasarkan gambar adalah …",
    options: [
      "A. Bayang-bayang pohon (gambar 2) menunjukkan cahaya merambat lurus & Huruf tampak besar (gambar 3) menunjukkan cahaya dibiaskan",
      "B. Bayangan apel (gambar 1) menunjukkan cahaya menembus benda bening",
      "C. Gambar 3 menunjukkan cahaya dipantulkan",
      "D. Gambar 2 menunjukkan cahaya merambat melengkung"
    ],
    key: "A"
  },
  {
    id: 28,
    type: "pg",
    question: "28. Perhatikan potongan gambar tata surya berikut!<br><img src='images/soal28_tata_surya.png' alt='Tata Surya' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Planet yang memiliki kala revolusi terlama ditunjukkan nomor 4. Planet nomor 1, 2, dan 3 secara berturut-turut adalah …",
    options: [
      "A. Venus, Bumi, Mars",
      "B. Bumi, Mars, Jupiter",
      "C. Mars, Jupiter, Saturnus",
      "D. Jupiter, Saturnus, Uranus"
    ],
    key: "A"
  },
  {
    id: 29,
    type: "pg",
    question: "29. Perhatikan gambar gerakan Bumi berikut!<br><img src='images/soal29_rotasi.png' alt='Rotasi Bumi' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Akibat dari gerakan Bumi (rotasi) yang ditunjukkan gambar tersebut adalah …",
    options: [
      "A. Perbedaan waktu (Yogyakarta 15.03 WIB, Jayapura 17.03 WIT) dan Gerak semu harian Matahari dari timur ke barat",
      "B. Perubahan musim di belahan bumi utara dan selatan",
      "C. Terjadinya gerhana matahari total",
      "D. Pergeseran titik terbit matahari pada bulan Juni"
    ],
    key: "A"
  },
  {
    id: 30,
    type: "pg",
    question: "30. Perhatikan gambar peristiwa gerhana berikut!<br><img src='images/soal30_gerhana.png' alt='Peristiwa Gerhana' class='my-3 max-h-48 mx-auto rounded border shadow-sm'><br>Gambar Gerhana Bulan Sebagian dan gambar Gerhana Matahari Cincin berturut-turut ditunjukkan nomor …",
    options: ["A. (w) dan (x)", "B. (w) dan (z)", "C. (x) dan (y)", "D. (y) dan (z)"],
    key: "D"
  }
];

// --- FUNGSI NAVIGASI LOGIN GURU & SISWA ---

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
  alert(`Status ujian untuk NISN ${nisnReset} berhasil di-reset! Siswa bisa login kembali.`);
  document.getElementById("reset-nisn").value = "";
}

// --- FUNGSI UTAMA UJIAN ---

async function loginSiswa() {
  const nisn = document.getElementById("nisn").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!nisn || !password) {
    alert("Isi NISN dan Password terlebih dahulu!");
    return;
  }

  if (localStorage.getItem(`exam_done_${nisn}`)) {
    alert("Anda sudah pernah mengikuti ujian ini! Hubungi guru untuk reset.");
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
    alert("Gagal terhubung ke server backend.");
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
      alert("Waktu ujian telah habis!");
      submitExam();
    }
  }, 1000);
}

// Render Palette Nomor Soal (Kotak Navigasi Interaktif)
function renderQuestionPalette() {
  const paletteContainer = document.getElementById("question-palette");
  if (!paletteContainer) return;
  paletteContainer.innerHTML = "";

  examData.forEach((q, idx) => {
    const btn = document.createElement("button");
    let isAnswered = userAnswers[q.id] !== undefined;
    let isCurrent = currentQuestionIndex === idx;

    let btnClass = "w-8 h-8 text-xs font-bold rounded border flex items-center justify-center transition ";
    if (isCurrent) {
      btnClass += "bg-blue-600 text-white border-blue-700 shadow ring-2 ring-blue-300";
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
    btn.className = `w-full text-left p-3 text-xs sm:text-sm border rounded-lg transition ${isSelected ? 'bg-green-100 border-green-600 font-semibold text-green-900' : 'hover:bg-green-50 bg-white text-gray-800'}`;
    btn.innerText = opt;
    btn.onclick = () => {
      userAnswers[q.id] = opt;
      renderQuestion();
      renderQuestionPalette();
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
    console.log("Pengiriman jawaban selesai.");
  }

  localStorage.setItem(`exam_done_${currentStudent.nisn}`, "true");

  document.getElementById("exam-card").classList.add("hidden");
  document.getElementById("result-card").classList.remove("hidden");

  let textWA = `Assalamu'alaikum Pak Guru, saya *${currentStudent.nama}* (NISN: ${currentStudent.nisn}) telah selesai mengikuti TRYOUT TKA IPAS Paket 3. Skor saya: *${finalScore}*. Terima kasih!`;
  document.getElementById("wa-link").href = `https://wa.me/${WA_GURU}?text=${encodeURIComponent(textWA)}`;
}
