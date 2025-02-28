import { useState, useEffect, useRef } from 'react';
import { Home, Plus, Settings, Trash, Edit, Check, X, MessageCircle, Compass, User, Mic, Send, LogOut } from 'lucide-react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

interface AdminPageProps {
  currentUser: { username: string; role: string };
  onLogout: () => void;
}

const AdminPage = ({ currentUser, onLogout }: AdminPageProps) => {
  const [adminView, setAdminView] = useState<'home' | 'api' | 'addUser'>('home');
  const [addedUsers, setAddedUsers] = useState<{ username: string; password: string; isLocked: boolean }[]>([]);
  const [apiKeys, setApiKeys] = useState<{ [key: string]: { key: string; isLocked: boolean } }>({
    siliconFlow: { key: '', isLocked: false },
  });

  // 加载保存的用户数据
  useEffect(() => {
    const savedUsers = localStorage.getItem('addedUsers');
    if (savedUsers) {
      setAddedUsers(JSON.parse(savedUsers));
    }

    const savedApiKeys = localStorage.getItem('apiKeys');
    if (savedApiKeys) {
      setApiKeys(JSON.parse(savedApiKeys));
    }
  }, []);

  // 保存用户数据到 localStorage
  const saveUsers = (users: { username: string; password: string; isLocked: boolean }[]) => {
    localStorage.setItem('addedUsers', JSON.stringify(users));
  };

  // 保存 API 密钥到 localStorage
  const saveApiKeys = (keys: { [key: string]: { key: string; isLocked: boolean } }) => {
    localStorage.setItem('apiKeys', JSON.stringify(keys));
  };

  const handleLoadKey = (source: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [source]: { ...prev[source], isLocked: true },
    }));
    saveApiKeys({
      ...apiKeys,
      [source]: { ...apiKeys[source], isLocked: true },
    });
  };

  const handleDisconnect = (source: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [source]: { ...prev[source], isLocked: false },
    }));
    saveApiKeys({
      ...apiKeys,
      [source]: { ...apiKeys[source], isLocked: false },
    });
  };

  const handleAddUser = (index: number) => {
    const updatedUsers = [...addedUsers];
    updatedUsers[index].isLocked = true;
    setAddedUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = addedUsers.filter((_, i) => i !== index);
    setAddedUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const handleChangeUser = (index: number) => {
    const updatedUsers = [...addedUsers];
    updatedUsers[index].isLocked = false;
    setAddedUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  return (
    <div className="min-h-screen bg-white p-4 max-w-full min-w-[20rem]">
      {adminView === 'home' && (
        <div>
          <h1 className="text-2xl font-bold">管理员页面</h1>
          <Button variant="ghost" onClick={onLogout} className="ml-4">
            <LogOut className="h-4 w-4" />
            退出
          </Button>
        </div>
      )}
      {adminView === 'api' && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">API 管理</h2>
          <div className="space-y-4 w-full">
            {Object.entries(apiKeys).map(([source, { key, isLocked }]) => (
              <div key={source} className="flex items-center space-x-2 w-full">
                <Input
                  placeholder={source}
                  value={key}
                  onChange={(e) =>
                    setApiKeys((prev) => ({
                      ...prev,
                      [source]: { ...prev[source], key: e.target.value },
                    }))
                  }
                  className="w-full placeholder:text-gray-400"
                  disabled={isLocked}
                />
                {isLocked ? (
                  <div className="flex space-x-2">
                    <Button variant="ghost" className="p-2">
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" onClick={() => handleDisconnect(source)} className="p-2">
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => handleLoadKey(source)} className="p-2">
                    加载
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {adminView === 'addUser' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-center">添加用户</h2>
          </div>
          <div className="fixed top-4 right-4">
            <Button
              variant="ghost"
              onClick={() => setAddedUsers([...addedUsers, { username: '', password: '', isLocked: false }])}
              className="min-w-[3rem] min-h-[3rem] p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {addedUsers.map((user, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="用户名"
                  value={user.username}
                  onChange={(e) => {
                    const updatedUsers = [...addedUsers];
                    updatedUsers[index].username = e.target.value;
                    setAddedUsers(updatedUsers);
                  }}
                  className="min-h-[3rem] placeholder:text-gray-400"
                  disabled={user.isLocked}
                />
                <Input
                  placeholder="密码"
                  type="password"
                  value={user.password}
                  onChange={(e) => {
                    const updatedUsers = [...addedUsers];
                    updatedUsers[index].password = e.target.value;
                    setAddedUsers(updatedUsers);
                  }}
                  className="min-h-[3rem] placeholder:text-gray-400"
                  disabled={user.isLocked}
                />
                <span className="text-sm text-gray-500">详情</span>
                {user.isLocked ? (
                  <div className="flex space-x-2">
                    <Button variant="destructive" onClick={() => handleDeleteUser(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleChangeUser(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="min-h-[3rem] bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleAddUser(index)}
                  >
                    <Check className="h-4 w-4 font-bold" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-around gap-5">
        <Button
          variant="ghost"
          onClick={() => setAdminView('home')}
          className="min-w-[3rem] min-h-[3rem] p-0"
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setAdminView('api')}
          className="min-w-[3rem] min-h-[3rem] p-0"
        >
          <Settings className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setAdminView('addUser')}
          className="min-w-[3rem] min-h-[3rem] p-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

interface DialoguePageProps {
  currentUser: { username: string; role: string };
  onLogout: () => void;
}

const DialoguePage = ({ currentUser, onLogout }: DialoguePageProps) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement | null>(null);
  const [totalContentLength, setTotalContentLength] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.lang = 'zh-CN';

      recognition.current.onresult = (event) => {
        setMessage(event.results[0][0].transcript);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    } else {
      alert('您的浏览器不支持语音识别功能');
    }
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = { role: 'user', content: message };
      setConversation((prev) => [...prev, userMessage]);
      setMessage('');

      try {
        const apiKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
        const token = apiKeys.siliconFlow.key;

        if (!token) {
          console.error('API Key is missing');
          setErrorMessage('API Key is missing. Please load the API key in the admin page.');
          return;
        }

        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-ai/DeepSeek-V3',
            messages: [...conversation, userMessage],
            stream: false,
            max_tokens: 512,
            temperature: 0.7,
            top_p: 0.7,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          if (errorData.message.includes('RPD limit reached')) {
            setErrorMessage('请求被拒绝，因为达到了每日请求限制。请进行实名验证以增加请求限制。');
          } else {
            setErrorMessage(`API Error: ${errorData.message}`);
          }
          return;
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          let rawContent = data.choices[0].message.content;
          // Remove "助手" prefix and special symbols
          rawContent = rawContent.replace(/助手|#/g, '').replace(/\*/g, '');
          // Split content into paragraphs
          const paragraphs = rawContent.split('\n\n').filter((p) => p.trim() !== '');
          const botMessage = { role: 'assistant', content: paragraphs.join('\n\n') };

          // Update conversation with bot message
          setConversation((prev) => [...prev, botMessage]);

          // Update total content length and line count
          const newContentLength = totalContentLength + botMessage.content.length;
          const newLineCount = lineCount + paragraphs.length;
          setTotalContentLength(newContentLength);
          setLineCount(newLineCount);
        } else {
          console.error('Unexpected API response:', data);
          setErrorMessage('Unexpected API response');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setErrorMessage('Error sending message: ' + error.message);
      } finally {
        scrollToBottom();
      }
    }
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      const conversationContainer = messageEndRef.current.parentElement;
      if (conversationContainer) {
        conversationContainer.scrollTop = conversationContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (totalContentLength > 100 && lineCount % 3 === 0) {
      scrollToBottom();
    }
  }, [totalContentLength, lineCount]);

  const handleVoiceInput = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 max-w-full min-w-[20rem]">
      {/* 对话内容 */}
      <div
        ref={conversationContainerRef}
        className="space-y-4 mb-20 overflow-y-auto max-h-[70vh]"
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
            } max-w-[70%]`}
          >
            <p className="text-sm whitespace-pre-wrap">
              {msg.content.split('\n\n').map((paragraph, paraIndex) => (
                <p key={paraIndex} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </p>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* 错误消息 */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* 历史会话列表 */}
      {showHistory && (
        <div className="fixed top-16 left-0 right-0 bg-white p-4 space-y-4 max-h-[50vh] overflow-y-auto">
          {conversation.map((msg, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">
                  {msg.role === 'user' ? '你' : '助手'}
                </span>
                <p className="text-sm whitespace-pre-wrap">
                  {msg.content.split('\n\n').map((paragraph, paraIndex) => (
                    <p key={paraIndex} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </p>
              </div>
              {index < conversation.length - 1 && <div className="border-t border-gray-200 mt-2" />}
            </div>
          ))}
        </div>
      )}

      {/* 固定底部输入栏 */}
      {!showHistory && (
        <div className="fixed bottom-16 left-0 right-0 bg-transparent p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="p-2" onClick={handleVoiceInput} disabled={isListening}>
              <Mic className="h-5 w-5" />
            </Button>
            <Input
              placeholder="输入消息..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent"
            />
            <Button onClick={handleSendMessage} className="p-2">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-around gap-5">
        <Button
          variant="ghost"
          className="min-w-[3rem] min-h-[3rem] p-0"
          onClick={() => setShowHistory(!showHistory)}
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" className="min-w-[3rem] min-h-[3rem] p-0">
          <Compass className="w-5 h-5" />
        </Button>
        <Button variant="ghost" className="min-w-[3rem] min-h-[3rem] p-0">
          <User className="w-5 h-5" />
        </Button>
        <Button variant="ghost" className="min-w-[3rem] min-h-[3rem] p-0">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [addedUsers, setAddedUsers] = useState<{ username: string; password: string; isLocked: boolean }[]>([]);

  // 加载保存的用户数据
  useEffect(() => {
    const savedUsers = localStorage.getItem('addedUsers');
    if (savedUsers) {
      setAddedUsers(JSON.parse(savedUsers));
    }
  }, []);

  const handleLogin = () => {
    // 管理员账号
    if (username === 'hyy' && password === '123456') {
      setCurrentUser({ username, role: 'admin' });
      setIsLoggedIn(true);
      return;
    }

    // 普通用户账号
    const user = addedUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setCurrentUser({ username, role: 'user' });
      setIsLoggedIn(true);
    } else {
      alert('用户名或密码错误');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {isLoggedIn && currentUser ? (
        currentUser.role === 'admin' ? (
          <AdminPage currentUser={currentUser} onLogout={handleLogout} />
        ) : (
          <DialoguePage currentUser={currentUser} onLogout={handleLogout} />
        )
      ) : (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">登录</h2>
          <Input
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleLogin} className="w-full">
            登录
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;