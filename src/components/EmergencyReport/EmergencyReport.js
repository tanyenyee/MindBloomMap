import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/EmergencyBackground.png'; 
import { IoArrowBack } from 'react-icons/io5';

const EmergencyReport = () => {
  const navigate = useNavigate();

 useEffect(() => {
        // 清除浏览器默认的 body margin/padding
    document.body.style.margin = '0!important';
    document.body.style.padding = '0!important';
    document.documentElement.style.margin = '0 !important';
    document.documentElement.style.padding = '0 !important';
        // 确保 body 能够适应 rootContainer
    document.body.style.width = '100vw';
    document.body.style.overflowX = 'hidden';
    document.body.style.minHeight = '100vh'; 

        // 卸载时恢复 (可选，但推荐)
    return () => {
        document.body.style.margin = '';
        document.body.style.padding = '';
        document.body.style.width = '';
        document.body.style.minHeight = '';
    };
  }, []); // 空数组确保只在挂载和卸载时运行

  // 1. State for managing the form inputs
  const [incidentType, setIncidentType] = useState('General');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
// 🚀 新增：Toast 提示状态
// toastMessage: 显示的消息内容 (或 null/empty string 表示不显示)
  const [toastMessage, setToastMessage] = useState(null); 
  // 🚀 计时器引用，用于清除 setTimeout
  const [toastTimer, setToastTimer] = useState(null);
  const [typeOfIncidentText, setTypeOfIncidentText] = useState('');
  // 🚀 关键修改：Hotlines 初始状态包含 Befrienders KL 和 Talian Kasih
  const [hotlines, setHotlines] = useState([
      { name: 'Mom', number: '0121231234' },{ name: 'Talian Kasih', number: '15999' }]); 
  const [isAddMoreModalOpen, setIsAddMoreModalOpen] = useState(false);
  // 2. Submit Handler
  const handleSubmit = () => {
    // Basic validation
    if (description.trim() === '') {
        alert('Please describe the incident before submitting.');
        return;
    }
    
    console.log({
        mainType: incidentType,
        detailedType: typeOfIncidentText,
        description: description,
        isAnonymous: isAnonymous
    });

// 🚀 新增：Toast 逻辑，与 handleToggleAnonymous 相似
    const message = "Quick Report Submitted Successfully!";
    
    // 清除任何现有的计时器，避免重复
    if (toastTimer) {
        clearTimeout(toastTimer);
        setToastTimer(null);
    }
    
    // 显示 Toast 消息
    setToastMessage(message);

    // 设置计时器，3秒后隐藏 Toast 
    const timer = setTimeout(() => {
        setToastMessage(null); // 隐藏 Toast
        setToastTimer(null);
    }, 3000); 
    
    setToastTimer(timer);
    
    // Reset form after submission
    setDescription('');
    setTypeOfIncidentText('');
    setIsAnonymous(false);
  };

  const handleAddMoreHotline = () => {
    // 🚀 关键修改：点击按钮时，打开模态框
    setIsAddMoreModalOpen(true);
    console.log("Add More Hotline button clicked.");
  };

  // 🚀 新增：处理匿名切换，并显示 Toast 提示
  const handleToggleAnonymous = () => {
    // 1. 切换状态 (新状态是旧状态的相反)
    const newState = !isAnonymous;
    setIsAnonymous(newState);

    // 2. 准备 Toast 消息
    const message = newState ? "Anonymous Mode On" : "Anonymous Mode Off";
        
    // 3. 清除任何现有的计时器，避免重复
    if (toastTimer) {
        clearTimeout(toastTimer);
        setToastTimer(null);
    }

    // 4. 显示 Toast 消息
    setToastMessage(message);

    // 5. 设置计时器，3秒后隐藏 Toast 
    const timer = setTimeout(() => {
        setToastMessage(null); // 隐藏 Toast
        setToastTimer(null);
    }, 3000); 
        
    setToastTimer(timer);
    };

  // 3. Styles for matching the UI draft look and feel (using inline styles for React Web)
  const styles = {
    rootContainer: {
        // 确保占据整个视口，以便背景图完整显示
        minHeight: '100vh', 
        width: '100%',
        boxSizing: 'border-box',
        
        // --- 背景图设置 ---
        backgroundImage: `url(${backgroundImage})`,
        //backgroundColor: 'red',
        backgroundSize: 'cover',        // 确保图片覆盖整个区域
        backgroundRepeat: 'no-repeat',  // 确保图片不重复
        backgroundPosition: 'center top', // 让图片从顶部开始居中显示
        backgroundAttachment: 'fixed', // (可选) 让背景固定，内容滚动
        padding: '20px', // 给内容增加一些边距
        margin: '-25px -9px -20px -9px',
        
        },
        headerRow: {
            display: 'flex',
            alignItems: 'center', 
            paddingLeft: '20px',  
            paddingTop: '20px',   
            margin: '0', 
            flexWarap:'nowrap',
            width: 'auto',
        },
        pageHeader: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333', // 确保文本颜色在背景上清晰可见
            margin: '0', // 底部留出 20px 间距
            paddingTop: '0px', // 从 rootContainer 的顶部开始留出空间
            //paddingLeft: '40px',
            marginLeft:'10px',
            width:'auto',
            display: 'inline-block',
            whiteSpace: 'nowrap',
        },
        iconStyle: {
            fontSize: '24px', // 与标题字体大小一致，使其对齐
            color: '#333',
            cursor: 'pointer',
            position: 'relative',
            top: '3px',
        },
    // --- Quick Report Styles (Existing) ---
    quickReportContainer: {
        // Light blue background matching the draft
        backgroundColor: '#D1ECF1', 
        height:'280px',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '10px 0',
        border: '1px solid #B8DAFF', // Adding a slight border for definition
        
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#0056b3',
        margin: '0',
        marginBottom: '3px',
    },
    typeRow: {
        height: '15px',
        margin: '0',
        alignItems: 'center',
        display:'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
        //width: '100%',
        marginLeft: '-5px',
    },
    selectInput: {
        padding: '4px 10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        //minWidth: '150px',
        //marginRight: '15px',
        flexGrow: 1, 
            
    },
    secondaryInputContainer: {
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0px',
    },
    secondaryInput: {
        border: 'none',
        outline: 'none',
        padding: '0',
        flexGrow: 1,
        fontSize: '14px',
    },
    actionRow: {
        display: 'flex',
        width:"90%",
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: '0px',
        marginBottom: '0',
        
    },
    uploadButton: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#fa2302ff',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        textAlign:'left',
        flexGrow: 1,
        paddingTop: '0',
        paddingBottom: '0',
        margin: '0',
        padding:"0",
        marginLeft: '-85px',
        alignSelf: 'flex-end',
        fontWeight: '2',
        
    },
    submitButton: {
        padding: '5px 10px',
        backgroundColor: '#B8DAFF', 
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        color: '#0056b3', 
        fontWeight: '600',
        fontSize: '14px',
        marginRight: '-55px',
        alignItems: 'center',
        justifyContent: 'center',
        height:'30px',
        display:'flex',
        width:'110px',
        alignSelf:'flex-end',
    },
    toggleSwitch: {
        width: '130px', 
        height: '20px', 
        backgroundColor: '#ccc', 
        borderRadius: '10px', 
        position: 'relative', 
        cursor: 'pointer',
    },
    toggleSlider: {
        width: '18px', 
        height: '18px', 
        backgroundColor: 'white', 
        borderRadius: '50%', 
        position: 'absolute', 
        top: '1px', 
        left: isAnonymous ? '21px' : '1px', 
        transition: '0.3s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
    },

// --- NEW: Toast Notification Styles ---
    toastContainer: {
        position: 'fixed',
        top: '20px', 
        left: '50%',
        transform: 'translateX(-50%)', // 居中
        zIndex: 1000,
        backgroundColor: '#4CAF50', // 成功的绿色
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        opacity: 0.95,
        transition: 'opacity 0.3s, top 0.3s',
    },
    
    // --- NEW: Safety Library & Hotlines Styles ---
    safetyCard: {
        backgroundColor: '#E6F0E6', // Light green background from draft
        padding: '20px',
        borderRadius: '15px',
        height: '270px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '20px 0',
    },
    libraryGrid: {
        display: 'flex', 
        gap: '10px',
        marginTop: '15px',
        overflowX: 'auto', // Allows side scrolling if items are too wide
    },
    libraryItem: {
        flex: '1 1 30%', // Allows 3 items to fit roughly
        backgroundColor: 'white', 
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        textAlign: 'left',
        minWidth: '150px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        fontSize: '14px',
        // 🚀 新增：实现垂直滚动
        height: '150px', // 设定一个固定的最大高度
        overflowY: 'auto', // 垂直方向超出时显示滚动条
    },
    itemTitle: {
        fontWeight: 'bold',
        marginBottom: '5px',
        fontSize: '15px',
        color: '#333',
    },
    divider: {
        height: '1px',
        backgroundColor: '#ccc',
        width: '100%',
        margin: '5px 0 10px 0',
    },
    hotlineCard: {
        backgroundColor: '#FAE6E6', // Light pink/red background from draft
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '20px 0',
        maxHeight: '200px', 
        overflowY: 'auto', 
        overflowX: 'hidden',
        paddingBottom: '0',
        height: 'auto',
        width:'auto',
    },
    hotlineLinks: {
        display: 'flex',
        flexWrap: 'wrap',
        flexFlow: 'column wrap',
        gap: '15px',
        marginTop: '0px',
        marginBottom:'0px',
        margin:'0',
        width:"100%",
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        gap: '10px',
        fontSize: 0,
    },
    hotlineButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '8px 15px',
        borderRadius: '20px', // More pill-shaped
        background: 'white',
        border: '1px solid #E0B4B4',
        textDecoration: 'none',
        color: '#555',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '0',
        marginTop: '0px',
        minHeight: 'auto',
        height: 'auto',
        alignItems: 'center',
        lineHeight: '1.0',
        verticalAlign: 'middle',
    },
    hotlineNumber: {
        color: '#D63030', // Red color for the number
        marginLeft: '5px',
        fontWeight: 'bold',
        flexShrink: 0, 
        flexGrow: 0,   
    },
    addMoreButton: {
        padding: '8px 15px',
        borderRadius: '20px',
        background: 'white',
        border: '1px solid #ccc',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        color: '#555',
        width:'100%',
        height:'50px',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',     
        margin:'0',
        minHeight: 'auto',
    }
 };

// 4. Component Structure
  return (
    <>
        <div style={styles.rootContainer} className="emergency-centre-view"> 
            <div style={styles.headerRow}></div>
            <IoArrowBack 
                style={styles.iconStyle}  
                onClick={() => navigate(-1)}
            />

            {/* Header */}
            <h1 style={styles.pageHeader}>Emergency & Safety Centre</h1>

            {/* Toast meassage */}
            {toastMessage && (
                <div style={{
                    ...styles.toastContainer,
                    // 如果消息包含 "Submitted"，使用确认色（例如蓝色/浅绿），否则使用匿名色
                    backgroundColor: toastMessage.includes('Submitted') 
                        ? '#007bff' // 提交成功的颜色：蓝色
                        : (toastMessage.includes('On') ? '#4CAF50' : '#352000ff') // 匿名切换的颜色
                }}>
                    {toastMessage}
                </div>
            )}

            {/* --------------------------- QUICK REPORT (EXISTING CODE) --------------------------- */}
            <div style={styles.quickReportContainer}>
                <h3 style={styles.sectionTitle}>Quick Report</h3>
              
                {/* 1st Row: Dropdown and Anonymous Toggle */}
                <div style={styles.typeRow}>
                    <select 
                        style={styles.selectInput}
                        value={incidentType}
                        onChange={(e) => setIncidentType(e.target.value)}
                    >
                        <option value="General">Type of incident</option>
                        <option value="Bullying">Bullying</option>
                        <option value="Safety">Safety Concern</option>
                        <option value="Health">Health Issue</option>
                        <option value="Other">Other</option>
                    </select>
                
                    <div style={{display:'flex', alignItems: 'center' }}>
        
                        {/* Simple Anonymous Toggle Placeholder */}
                        <div 
                            style={{...styles.toggleSwitch, backgroundColor: isAnonymous ? '#007bff' : '#ccc'}}
                            onClick={handleToggleAnonymous}
                        >
                            <div style={styles.toggleSlider}></div>
                        </div>
                    </div>
                    {/* --- ⬆️ 结束修改的代码块 ⬆️ --- */}
                </div>
              
               

                {/* 3rd Row: Description Input Area */}
                <textarea
                    style={{ height: '110px', width: '90%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'none',marginBottom: '0px', margin: '0',}}
                    placeholder="Describe here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* 4th Row: Upload and Submit Buttons */}
                <div style={styles.actionRow}>
                    <button 
                            style={styles.uploadButton}
                            onClick={() => alert('File Upload functionality goes here!')}
                    >
                        <span style={{ fontSize: '0px', marginRight: '3px',top: '-5px'}}>&#x2191;</span> ***Upload evidence here.
                    </button>
                
                    <button 
                            style={styles.submitButton}
                            onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
            {/* --------------------------- END QUICK REPORT --------------------------- */}
            

            {/* --------------------------- NEW: SAFETY LIBRARY --------------------------- */}
            <div style={styles.safetyCard}>
                <h3 style={{...styles.sectionTitle, color: '#4CAF50'}}>Safety Library</h3>
                <div style={styles.libraryGrid}>
                    
                    {/* Item 1: How to Stay Safe Online */}
                    <div style={{...styles.libraryItem, borderTop: '5px solid #A5D6A7'}}>
                        <h4 style={styles.itemTitle}>How to Stay Safe Online</h4>
                        <div style={styles.divider}></div>
                        <p style={{fontSize: '0.85em', color: '#666'}}>Be cautious with personal information at all times, especially in the digital world. Avoid sharing sensitive details such as your full name, home address, phone number, passwords, identification numbers, or financial information unless it is absolutely necessary and you are certain the platform is secure. Be careful with emails, messages, and online requests, particularly those from unknown senders, as they may be phishing attempts designed to steal your information. Do not click on suspicious links or download attachments without checking their authenticity. Think carefully before you post on social media, because once something is shared online, it can spread quickly and may be impossible to fully remove. Your personal information can be misused for scams, identity theft, or other harmful activities, so always prioritize your privacy and online safety.
                        </p>
                    </div>
                    
                    {/* Item 2: Steps to Report Bullying */}
                    <div style={{...styles.libraryItem, borderTop: '5px solid #FFCD53'}}>
                        <h4 style={styles.itemTitle}>Steps to Report Bullying</h4>
                        <div style={styles.divider}></div>
                        <p style={{fontSize: '0.85em', color: '#666'}}>There are many ways to report a bully, and it is important to choose the method that makes you feel safest and most supported. Bullying can be reported to specific organizations such as school authorities, workplace management, online platform administrators, or helplines that handle bullying and harassment cases. In addition, you can report this issue to people you trust, such as teachers, parents, guardians, friends, counselors, or supervisors, who can offer guidance and help take appropriate action. Keeping evidence like messages, screenshots, or dates of incidents can also be useful when making a report. Reporting a bully is a brave step that can help protect not only yourself but also others who may be experiencing the same situation.
                        </p>
                    </div>
                    
                    {/* Item 3: How to Support a Friend in Need */}
                    <div style={{...styles.libraryItem, borderTop: '5px solid #FFCD53'}}>
                        <h4 style={styles.itemTitle}>How to Support a Friend in Need</h4>
                        <div style={styles.divider}></div>
                        <p style={{fontSize: '0.85em', color: '#666'}}>As a bystander, you should not ignore a bullying situation when you notice it happening around you. If it is safe to do so, step in calmly to stop the behavior or show support to the person being bullied. You can also help by reporting the incident to a trusted adult, teacher, supervisor, or relevant authority so proper action can be taken. Offering comfort and support to the victim is important, as it helps them feel less alone. Avoid encouraging the bully by laughing, sharing harmful content, or staying silent. Being a responsible bystander can make a big difference in preventing bullying and creating a safer environment for everyone.
                        </p>
                    </div>
                    
                </div>
            </div>
            {/* --------------------------- END SAFETY LIBRARY --------------------------- */}
            {/* --------------------------- NEW: HOTLINES --------------------------- */}
            <div style={styles.hotlineCard}>
                <h3 style={{...styles.sectionTitle, color: '#D63030'}}>Hotlines</h3>
                {/* 🎯 关键修正 2: 在两个主要元素之间插入一个空的花括号表达式 */}
                {}
                <div style={styles.hotlineLinks}>
                    {/* ... Hotlines map 代码 ... */}
                    {hotlines.map((line, index) => (
                        <div 
                            key={index} 
                            style={styles.hotlineButton} >
                            <span 
                                style={{ 
                                    whiteSpace: 'nowrap',
                                    display: 'inline-block',
                                    verticalAlign: 'top', 
                                    lineHeight: '1.0',
                                }}
                            >
                            {line.name} 
                            </span>
                            <span style={styles.hotlineNumber}>{line.number}</span>
                        </div>
                    ))}
                    {}{/* Add More Button */}
                    <button
                        style={{ ...styles.addMoreButton, alignSelf: 'flex-start' }}
                        onClick={handleAddMoreHotline}
                    >
                        <span style={{fontSize: '1.5em', fontWeight: 'bold'}}>+</span>
                    </button>
                </div>
            </div>
            {/* --------------------------- END HOTLINES --------------------------- */}
        </div>
        {/* 🚀 模态框调用 (紧跟在主 div 之后) */}
        {isAddMoreModalOpen && (
            <AddMoreHotlineModal 
                onClose={() => setIsAddMoreModalOpen(false)} 
                onAddHotline={(newHotline) => {
                    setHotlines([...hotlines, newHotline]); 
                    setIsAddMoreModalOpen(false); 
                }}
            />
        )}
        
    </> // 🎯 关键修改：在这里添加结束 Fragment 标签
  );
};
// =========================================================
// AddMoreHotlineModal Component Definition (已修正)
// =========================================================
const AddMoreHotlineModal = ({ onClose, onAddHotline }) => {
    // 🎯 关键修正：将 React.useState 替换为 useState
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [error, setError] = useState('');
    const handleAdd = () => {
        if (name.trim() === '' || number.trim() === '') {
            setError('Both Name and Number are required.');
            return;
        }       
        // 传递新的热线数据给父组件
        onAddHotline({ name, number });
    };
    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        input: {
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1em',
            width: '100%',
            boxSizing: 'border-box',
        },
        errorText: {
            color: '#D63030',
            fontSize: '0.9em',
            margin: '0',
        },
        buttonRow: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
            marginTop: '10px',
        },
        addButton: {
            padding: '10px 15px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#D63030', 
            color: 'white',
            cursor: 'pointer',
            flex: 1,
            fontSize: '1em',
        },
        cancelButton: {
            padding: '10px 15px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            color: '#333',
            cursor: 'pointer',
            flex: 1,
            fontSize: '1em',
        }
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: '0', color: '#D63030' }}>Add New Hotline</h3>
                {error && <p style={modalStyles.errorText}>{error}</p>}
                <input
                    style={modalStyles.input}
                    type="text"
                    placeholder="Hotline Name (e.g., Suicide Prevention)"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }}
                />
                <input
                    style={modalStyles.input}
                    type="text"
                    placeholder="Hotline Number (e.g., 0376272929)"
                    value={number}
                    onChange={(e) => {
                        setNumber(e.target.value);
                        setError('');
                    }}
                />
                <div style={modalStyles.buttonRow}>
                    <button style={modalStyles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button style={modalStyles.addButton} onClick={handleAdd}>
                        Add Hotline
                    </button>
                </div>
            </div>
        </div>
    );
};
export default EmergencyReport;