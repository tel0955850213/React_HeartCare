import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    text-align: center;
    padding: 20px;
    margin: 0;
    background-color: ${props => props.$isDarkMode ? '#1a1a1a' : '#f5f5f7'};
    color: ${props => props.$isDarkMode ? '#ffffff' : '#1d1d1f'};
    transition: all 0.3s ease;
`;

const BannerImage = styled.img`
    width: 50%; // 縮小圖片尺寸
    max-width: 600px; // 設置最大寬度
    height: auto;
    margin: 20px auto;
    display: block;
`;

const Title = styled.h1`
    font-size: 3.5rem;
    color: #1d1d1f;
    margin: 20px 0;
    font-weight: 600;
`;

const Subtitle = styled.h2`
    font-size: 1.8rem;
    color: #1d1d1f;
    margin-bottom: 30px;
    font-weight: normal;
`;

const StartButton = styled.button`
    background-color: #0066cc;
    color: white;
    padding: 12px 24px;
    border-radius: 980px; // 蘋果風格的圓角按鈕
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0052a3;
    }
`;

const TestContainer = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
`;

const QuestionCard = styled.div`
    margin: 20px auto;
    padding: 20px;
    background-color: ${props => props.$isDarkMode ? '#2a2a2a' : '#ffffff'};
    border-radius: 10px;
    width: 100%;
    max-width: 800px;
    text-align: center;
    color: ${props => props.$isDarkMode ? '#ffffff' : '#1d1d1f'};
    transition: all 0.3s ease;
`;

const OptionsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    margin-top: 20px;
    max-width: 400px;
    margin: 20px auto;
    position: relative;
`;

const Option = styled.div`
    width: ${props => {
        if (props.value === 1 || props.value === 5) return '55px';
        if (props.value === 2 || props.value === 4) return '45px';
        return '40px';
    }};
    height: ${props => {
        if (props.value === 1 || props.value === 5) return '55px';
        if (props.value === 2 || props.value === 4) return '45px';
        return '40px';
    }};
    border: 2px solid ${props => props.selected ? 
        (props.$isDarkMode ? '#ffffff' : '#0066cc') : 
        (props.$isDarkMode ? '#666' : '#ccc')};
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &:hover {
        border-color: ${props => props.$isDarkMode ? '#ffffff' : '#0066cc'};
    }

    ${props => props.selected && `
        &::after {
            content: '';
            width: 60%;
            height: 60%;
            background: ${props.$isDarkMode ? '#ffffff' : '#0066cc'};
            border-radius: 50%;
        }
    `}
`;

const ScaleLabels = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: absolute;
    bottom: -25px;
    left: 0;
    font-size: 0.9rem;
    color: ${props => props.$isDarkMode ? '#bbb' : '#666'};
`;

const AnalyzeButton = styled.button`
    background-color: #0066cc;
    color: white;
    padding: 12px 24px;
    border-radius: 980px;
    border: none;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 20px;

    &:hover {
        background-color: #0052a3;
    }
`;

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0066cc;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: ${spin} 1s linear infinite;
    margin: 20px auto;
`;

const questions = [
    "我經常感到被他人理解的困難。",
    "當面對壓力時，我能找到適合自己的方式來紓解。",
    "我時常會為了他人的期待而委屈自己。",
    "我能夠清楚地表達自己的情緒和需求。",
    "我經常會反思自己的行為和想法。",
    "在社交場合中，我常常感到不自在。",
    "我相信自己有能力處理生活中的各種挑戰。",
    "我容易受到他人的情緒影響。",
    "我常常會關注自己的內心感受。",
    "我能夠接納自己的不完美。",
    "在做決定時，我常常猶豫不決。",
    "我願意嘗試新的事物和體驗。",
    "我經常感到孤單，即使身處人群中。",
    "我能夠在失敗後重新振作。",
    "我常常為未來感到焦慮。",
    "我能夠與他人建立深層的情感連結。",
    "我對生活充滿好奇和期待。",
    "我常常覺得自己與眾不同。",
    "我能夠在困境中保持希望。",
    "我願意為了成長而走出舒適圈。"
];

const ResultContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: ${props => props.$isDarkMode ? '#1a1a1a' : '#ffffff'};
    border-radius: 15px;
    box-shadow: ${props => props.$isDarkMode ? '0 0 15px rgba(0,0,0,0.3)' : '0 0 15px rgba(0,0,0,0.1)'};
`;

const PersonalityTitle = styled.h2`
    color: ${props => props.$isDarkMode ? '#4a9eff' : '#0066cc'};
    margin-bottom: 30px;
    font-size: 2rem;
`;

const ResultSection = styled.div`
    background-color: ${props => props.$isDarkMode ? '#2d2d2d' : '#f5f5f5'};
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: left;

    h3 {
        color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
        margin-bottom: 15px;
        text-align: center;
    }

    p {
        color: ${props => props.$isDarkMode ? '#e0e0e0' : '#333333'};
        line-height: 1.6;
    }
`;

const RecommendBook = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 20px;
    background: #e6f0ff;
    border-radius: 10px;
    margin: 30px auto;
    max-width: 800px;
    width: 100%;
    
    h3 {
        color: #333;
        margin-bottom: 15px;
    }
    
    p {
        color: #444;
        line-height: 1.6;
    }
    
    .price {
        color: #333;
        font-weight: bold;
        margin: 15px 0;
    }
`;

const BookImage = styled.img`
    width: 120px;
    height: 170px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const BookInfo = styled.div`
    flex: 1;
`;

const AddToCartButton = styled.button`
    background-color: #0066cc;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0052a3;
    }
`;

const personalityTypes = [
    {
        type: 'EXPLORER',
        description: "你是個天生的探險家，充滿好奇心和冒險精神。你渴望探索未知，無論是實體世界還是知識領域。你喜歡挑戰自我，突破舒適圈。在你眼中，每一天都是新的冒險，每個陌生人都可能帶來有趣的故事。你的適應力強，能在各種環境中找到樂趣。",
        traits_challenges: "你具有強烈的冒險精神和適應能力，但有時會因為過度追求刺激而忽略穩定的重要性。你容易對日常感到無聊，可能會錯過生活中的細小美好。",
        solutions: "學習在日常中發現冒險的樂趣，培養一些能帶來持續成就感的愛好，建立健康的風險評估能力",
        book: {
            id: 1,
            title: "哈利波特：神秘的魔法石",
            price: 450,
            image: "/images/books/book1.jpg",
            description: "這本書特別適合你，因為它不僅能帶你進入奇幻的魔法世界，更重要的是，書中充滿了邏輯謎題和深刻的哲理。就像你一樣，主角哈利也常常需要運用智慧來解決問題。赫敏的理性思考方式一定會讓你產生共鳴，而魔法世界的奧秘正需要你這樣細心的觀察者去探索。"
        }
    },
    {
        type: 'DREAMER',
        description: "你是個充滿想像力的夢想家，你的思維如彩虹般絢麗多彩。在你的世界裡，一切皆有可能。你對美和創造力有著獨特的感知，能夠在平凡中發現不平凡。",
        traits_challenges: "你擁有豐富的創造力和藝術天賦，但有時會因為過度理想化而與現實產生落差。",
        solutions: "建立日常規律來平衡理想與現實，參與創意活動來表達自我，尋找志同道合的朋友分享想法",
        book: {
            id: 2,
            title: "世界冰冷，哲學是篝火",
            price: 320,
            image: "/images/books/book2.jpg",
            description: "這本書簡直是為你量身打造的！你那顆純淨的心靈和對世界的好奇，就像是你的靈魂映照。書中對愛、友誼和生命意義的探討，正好呼應了你對深層情感的渴望。當你每天都讀到哲學時，相信一定會為其中蘊含的哲理而感動。這本書會像一魔鏡，映照出你內心最美的風景。"
        }
    },
    {
        type: 'THINKER',
        description: "你是個深邃的思考者，總是能看到事物的本質。你喜歡分析複雜的問題，並且經常沉浸在自己的思維世界中。你的觀察力極為敏銳，常常能發現別人忽略的細節。",
        traits_challenges: "你具有強大的分析能力和邏輯思維，但有時會陷入過度思考的困境。",
        solutions: "練習正念冥想來放鬆大腦，學習接受不完美，培養同理心和情感表達能力",
        book: {
            id: 3,
            title: "吳若權，金剛經讀寫組合",
            price: 520,
            image: "/images/books/book3.jpg",
            description: "這本書完美契合你的冒險靈魂！。世間的冒險之旅會讓你熱血沸騰，西方極樂世界的每一個角落都在呼喚著你去探索。書中的友情和勇氣主題，更會激勵你在人生的冒險中勇往直前。當你沉浸在托爾金筆下的奇幻世界時，彷彿就能聽到冒險的號角在召喚！"
        }
    },
    {
        type: "守護者(The Guardian)",
        description: "你是個天生的守護者，具有強烈的責任感和同理心。你總是能察覺他人的需求，並願意伸出援手。你重視穩定和和諧，善於創造安全舒適的環境。你的可靠和真誠使你成為他人信賴的對象。在團體中，你常常扮演著維繫和平的重要角色。",
        traits_challenges: "你擁有強大的同理心和照顧他人的能力，但有時會因為過度關心他人而忽略自己的需求。你可能會把別人的期待看得太重，導致承擔過多責任。",
        solutions: "學習設立健康的界限，培養自我關愛的習慣，允許自己說「不」",
        book: {
            id: 4,
            title: "我是這樣的媽媽",
            price: 380,
            image: "/images/books/book4.jpg",
            description: "這本書特別適合你這樣充滿保護慾的靈魂！納尼亞世界中的亞斯蘭獅王，就像是你內心守護者特質的完美體現。書中的四個孩子如何守護納尼亞的故事，一定會觸動你心中最柔軟的部分。而魔衣櫥這個連接兩個世界的神奇之門，象徵著你在現實與理想之間搭建橋樑的能力。當你閱讀這本書時，相信會更加堅定你守護他人的信念！"
        }
    },
    {
        type: "創造者(The Creator)",
        description: "你是個天賦異稟的創造者，總能將想像轉化為現實。你的思維方式與眾不同，常常能找到創新的解決方案。你享受創作的過程，無論是藝術、科技還是生活方式的創新。你的熱情和創造力能感染周圍的人，激發他們的創意潛能。",
        traits_challenges: "你具有獨特的創意思維和表達能力，但有時會因為追求完美而延遲完成作品。你可能會因為靈感源源不絕而難以專注於單一項目。",
        solutions: "建立創作時間管理系統，學習如何完成而不是追求完美，找到平衡創意和執行力的方法",
        book: {
            id: 5,
            title: "害羞者的社交手冊",
            price: 450,
            image: "/images/books/book5.jpg",
            description: "這本書絕對能激發你無限的創造力！羅伯特．喬丹創造的龐大世界觀，就像是為你這樣的創造者準備的靈感寶庫。書中獨特的魔法系統「一源」，象徵著創造力的源泉，而主角蘭德面對命運的創新思維，正如你面對挑戰時的創意解決方案。當你沉浸在這個宏大的奇幻世界時，相信會迸發出更多精彩的創意火花！"
        }
    }
];

const QuestionNumber = styled.span`
    font-weight: 600;
    margin-right: 10px;
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
`;

const PageTitle = styled.h2`
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
    margin-bottom: 30px;
    transition: all 0.3s ease;
`;

const SubTitle = styled.h3`
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
    margin: 20px 0;
`;

const QuestionText = styled.div`
    font-weight: 600;
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
    margin-bottom: 20px;
`;

const BookTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: ${props => props.$isDarkMode ? '#ffffff' : '#000000'};
`;

const BookDescription = styled.p`
    color: ${props => props.$isDarkMode ? '#e0e0e0' : '#666'};
    margin-bottom: 20px;
    line-height: 1.6;
`;

const BookPrice = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    color: #e53935;
    margin-bottom: 20px;
`;

const RecommendedBook = styled.div`
    display: flex;
    background: ${props => props.$isDarkMode ? '#2d2d2d' : 'white'};
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin: 20px 0;
`;

const Home = () => {
    const { isDarkMode } = useTheme();
    const [showTest, setShowTest] = useState(false);
    const [answers, setAnswers] = useState({});
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [recommendedBook, setRecommendedBook] = useState(null);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAnswer = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    // 計算得分
    const calculateScores = (answers) => {
        let scores = {
            EXPLORER: 0,
            DREAMER: 0,
            THINKER: 0
        };

        Object.entries(answers).forEach(([questionIndex, value]) => {
            const index = parseInt(questionIndex);
            if (index < 7) {  // 前7題
                if (value >= 4) scores.EXPLORER++;
                else if (value <= 2) scores.THINKER++;
                else scores.DREAMER++;
            } else if (index < 14) {  // 中間7題
                if (value >= 4) scores.DREAMER++;
                else if (value <= 2) scores.EXPLORER++;
                else scores.THINKER++;
            } else {  // 最後6題
                if (value >= 4) scores.THINKER++;
                else if (value <= 2) scores.DREAMER++;
                else scores.EXPLORER++;
            }
        });

        return scores;
    };

    // 決定性格類型
    const determinePersonalityType = (scores) => {
        const maxScore = Math.max(scores.EXPLORER, scores.DREAMER, scores.THINKER);
        
        if (scores.EXPLORER === maxScore) return 'EXPLORER';
        if (scores.DREAMER === maxScore) return 'DREAMER';
        return 'THINKER';
    };

    const handleAnalyze = () => {
        // 檢查是否所有題目都已回答
        if (Object.keys(answers).length < questions.length) {
            alert('請回答所有問題');
            return;
        }

        setAnalyzing(true);  // 開始顯示轉圈圈
        
        // 延遲 1.75 秒後顯示結果
        setTimeout(() => {
            // 計算得分
            const scores = calculateScores(answers);
            
            // 決定類型
            const type = determinePersonalityType(scores);
            
            // 找到對應的性格描述
            const personality = personalityTypes.find(p => 
                p.type.toUpperCase().includes(type)
            );
            
            // 設置結果
            setAnalysisResult(personality);
            setAnalyzing(false);  // 停止顯示轉圈圈
        }, 1750);  // 1.75 秒後執行
    };

    // 根據測驗結果獲取推薦書籍
    useEffect(() => {
        const fetchRecommendedBook = async () => {
            try {
                const testResult = localStorage.getItem('testResult');
                if (!testResult) return;

                const response = await axios.get(
                    `http://localhost:8080/api/books/recommend?type=${testResult}`,
                    { withCredentials: true }
                );
                
                if (response.data.status === 200) {
                    setRecommendedBook(response.data.data);
                }
            } catch (error) {
                console.error('獲取推薦書籍失敗:', error);
            }
        };

        fetchRecommendedBook();
    }, [analysisResult]); // 改為依賴 analysisResult

    const handleAddToCart = (book) => {
        if (!user) {
            alert('請先登入');
            navigate('/login');
            return;
        }
        addToCart(book);
        alert('已加入購物車！');
    };

    return (
        <PageContainer $isDarkMode={isDarkMode}>
            <BannerImage src="/images/banners/banner1.jpg" alt="Mental Health Test" />
            <PageTitle $isDarkMode={isDarkMode}>心理健康評估</PageTitle>
            <SubTitle $isDarkMode={isDarkMode}>了解你的心理健康狀況</SubTitle>
            {!showTest ? (
                <StartButton onClick={() => setShowTest(true)}>開始測驗</StartButton>
            ) : (
                <TestContainer>
                    {questions.map((question, index) => (
                        <QuestionCard key={index} $isDarkMode={isDarkMode}>
                            <div>
                                <QuestionNumber>{index + 1}.</QuestionNumber>
                                {question}
                            </div>
                            <OptionsContainer>
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <Option 
                                        key={value}
                                        value={value}
                                        selected={answers[index] === value}
                                        onClick={() => handleAnswer(index, value)}
                                    />
                                ))}
                                <ScaleLabels>
                                    <span>非常不同意</span>
                                    <span>非常同意</span>
                                </ScaleLabels>
                            </OptionsContainer>
                        </QuestionCard>
                    ))}
                    {analyzing ? (
                        <Spinner />
                    ) : (
                        <AnalyzeButton onClick={handleAnalyze}>分析結果</AnalyzeButton>
                    )}
                </TestContainer>
            )}
            {analysisResult && (
                <ResultContainer $isDarkMode={isDarkMode}>
                    <PersonalityTitle $isDarkMode={isDarkMode}>
                        你是：{analysisResult.type === 'EXPLORER' ? '探險家(The Explorer)' :
                              analysisResult.type === 'DREAMER' ? '夢想家(The Dreamer)' :
                              '思考者(The Thinker)'}
                    </PersonalityTitle>
                    <ResultSection $isDarkMode={isDarkMode}>
                        <h3>你是怎樣的人</h3>
                        <p>{analysisResult.description}</p>
                    </ResultSection>
                    <ResultSection $isDarkMode={isDarkMode}>
                        <h3>性格特質與當前挑戰</h3>
                        <p>{analysisResult.traits_challenges}</p>
                    </ResultSection>
                    <ResultSection $isDarkMode={isDarkMode}>
                        <h3>建議解決方案</h3>
                        <p>{analysisResult.solutions}</p>
                    </ResultSection>
                    <RecommendBook>
                        <BookImage src={analysisResult.book.image} alt={analysisResult.book.title} />
                        <BookInfo>
                            <h3>推薦書籍</h3>
                            <h4>{analysisResult.book.title}</h4>
                            <p>{analysisResult.book.description}</p>
                            <p className="price">NT$ {analysisResult.book.price}</p>
                            <AddToCartButton onClick={() => handleAddToCart(analysisResult.book)}>
                                加入購物車
                            </AddToCartButton>
                        </BookInfo>
                    </RecommendBook>
                </ResultContainer>
            )}
            {recommendedBook && (
                <RecommendedBook>
                    <BookImage 
                        src={recommendedBook.imageUrl} 
                        alt={recommendedBook.name}
                        onError={(e) => {
                            e.target.src = '/images/books/default.jpg';
                        }}
                    />
                    <BookInfo>
                        <BookTitle>{recommendedBook.name}</BookTitle>
                        <BookDescription>
                            {recommendedBook.description}
                        </BookDescription>
                        <BookPrice>NT$ {recommendedBook.price}</BookPrice>
                        <AddToCartButton onClick={() => handleAddToCart(recommendedBook)}>
                            加入購物車
                        </AddToCartButton>
                    </BookInfo>
                </RecommendedBook>
            )}
        </PageContainer>
    );
};

export default Home;

