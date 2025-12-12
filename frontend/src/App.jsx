import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, AlertTriangle, CheckCircle, Loader2, RotateCcw } from 'lucide-react';

const API_BASE = 'http://localhost:6543/api';

function App() {
  // --- STATE ---
  const [productName, setProductName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  // --- EFFECT: Load History saat pertama buka ---
  useEffect(() => {
    fetchHistory();
  }, []);

  // --- API CALLS ---
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reviews`);
      setHistory(res.data);
      console.log("History loaded:", res.data);
    } catch (err) {
      console.error("Gagal ambil history", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !reviewText) {
      setError("ISI SEMUA KOLOM, JANGAN MALAS!");
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const payload = { product_name: productName, review_text: reviewText, rating: 0 };
      const res = await axios.post(`${API_BASE}/analyze-review`, payload);
      
      setResult(res.data.data); 
      fetchHistory(); 
      
      // Reset form
      setProductName('');
      setReviewText('');
    } catch (err) {
      setError("SERVER MELEDAK ATAU MATI. CEK TERMINAL.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const getSentimentInfo = (sentiment, rating) => {
    // Prioritas 1: Jika Rating 3, NEUTRAL 
    if (rating === 3) {
      return { text: "NEUTRAL", color: "#607D8B" }; // Abu-abu kebiruan
    }
    // Prioritas 2: Cek label dari AI
    if (sentiment === "POSITIVE") {
      return { text: "POSITIVE", color: "#00E676" }; // Hijau Neon
    }
    if (sentiment === "NEGATIVE") {
      return { text: "NEGATIVE", color: "#FF5252" }; // Merah
    }
    // Fallback
    return { text: "UNKNOWN", color: "#9E9E9E" };
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        fill={i < count ? "black" : "transparent"} 
        stroke="black" 
        strokeWidth={3}
        size={20}
        style={{ marginRight: 2 }}
      />
    ));
  };

  const formatPoints = (text) => {
    if (!text) return <p>Tidak ada poin penting.</p>;
    const points = text.split(/\n|•|\*/).filter(p => p.trim().length > 0);
    return (
      <ul style={{ paddingLeft: '20px', margin: 0 }}>
        {points.map((p, idx) => (
          <li key={idx} style={{ marginBottom: '5px', fontWeight: 'bold' }}>{p.trim()}</li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div className="neo-box" style={{ background: '#FF5252', marginBottom: '30px', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, textTransform: 'uppercase', letterSpacing: '-2px' }}>
          REVIEW <span style={{ color: 'white', textShadow: '4px 4px 0px black' }}>ANALYZER</span>
        </h1>
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>POWERED BY HUGGING FACE & GEMINI AI</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        
        {/* KOLOM KIRI: FORM INPUT */}
        <div>
          <div className="neo-box" style={{ padding: '30px', background: '#00BCD4' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', borderBottom: '4px solid black' }}>INPUT DATA</h2>
            
            {error && (
              <div className="neo-box" style={{ background: '#FF5252', color: 'white', padding: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle stroke="black" strokeWidth={3} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{display: 'block', fontWeight: '900', marginBottom: '5px'}}>PRODUCT NAME</label>
              <input 
                className="neo-input" 
                placeholder="Ex: Laptop Gaming Z"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />

              <label style={{display: 'block', fontWeight: '900', marginBottom: '5px'}}>REVIEW TEXT</label>
              <textarea 
                className="neo-input" 
                rows="6" 
                placeholder="Tulis keluhan atau pujianmu di sini..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <button className="neo-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Loader2 className="animate-spin" /> ANALYZING...
                  </span>
                ) : "ANALYZE NOW!"}
              </button>
            </form>
          </div>

          {/* HASIL ANALISIS  */}
          {result && (
            <div className="neo-box" style={{ marginTop: '30px', padding: '0', background: 'white', border: '4px solid black' }}>
               <div style={{ background: '#00E676', padding: '15px', borderBottom: '4px solid black' }}>
                 <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <CheckCircle strokeWidth={3} /> ANALYSIS RESULT
                 </h2>
               </div>
               <div style={{ padding: '20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div>
                      <span style={{ fontWeight: '900', fontSize: '0.8rem', color: '#888' }}>SENTIMENT</span>
                      
                      {(() => {
                        const { text, color } = getSentimentInfo(result.sentiment, result.rating);
                        return (
                          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: color }}>
                            {text}
                          </div>
                        );
                      })()}

                    </div>
                    <div>
                      <span style={{ fontWeight: '900', fontSize: '0.8rem', color: '#888' }}>RATING</span>
                      <div style={{ display: 'flex' }}>{renderStars(result.rating)}</div>
                    </div>
                 </div>

                 <div className="neo-box" style={{ background: '#EEE', padding: '15px', border: '2px solid black', boxShadow: '4px 4px 0px black' }}>
                   <span style={{ fontWeight: '900', fontSize: '0.9rem', textDecoration: 'underline' }}>KEY POINTS (BY GEMINI):</span>
                   <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                     {formatPoints(result.key_points)}
                   </div>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: HISTORY  */}
        <div>
          <div className="neo-box" style={{ padding: '30px', background: '#9C27B0', height: '100%', minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '4px solid black', paddingBottom: '10px' }}>
              <h2 style={{ fontSize: '2rem', color: 'white', textShadow: '3px 3px 0px black', margin: 0 }}>HISTORY</h2>
              <button onClick={fetchHistory} className="neo-btn" style={{ width: 'auto', padding: '5px 10px', boxShadow: 'none' }}>
                <RotateCcw size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '700px', overflowY: 'auto', paddingRight: '10px' }}>
              
              {/* Pesan jika kosong */}
              {history.length === 0 && (
                <div style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
                  Belum ada data review. Mulai analisis sekarang!
                </div>
              )}
              
              {/* Loop History */}
              {history.map((item) => (
                <div key={item.id} className="neo-box" style={{ padding: '15px', boxShadow: '5px 5px 0px black' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span className="neo-tag" style={{ background: 'yellow' }}>#{item.id}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {item.created_at ? item.created_at.substring(0, 10) : '-'}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: '5px 0', fontSize: '1.2rem', textTransform: 'uppercase' }}>{item.product_name}</h3>
                  
                  <p style={{ fontSize: '0.9rem', fontStyle: 'italic', background: '#eee', padding: '5px', border: '1px solid black' }}>
                    "{item.review_text.substring(0, 80)}..."
                  </p>

                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     
                     {(() => {
                        const { text, color } = getSentimentInfo(item.sentiment, item.rating);
                        return (
                           <div className="neo-tag" style={{ background: color, color: 'black' }}>
                             {text}
                           </div>
                        );
                     })()}

                     <div style={{ display: 'flex' }}>{renderStars(item.rating)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
