import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoChatbubbleOutline, IoSend, IoNutritionOutline, IoBulbOutline, IoCheckmarkCircle, IoMic, IoMicOff } from 'react-icons/io5';
import { BsRobot, BsPerson } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, addUserMessage, setTyping, resetChat } from '../app/features/coachSlice';
import ReactMarkdown from 'react-markdown';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const suggestedQuestions = [
  'How can I lose weight healthily?',
  'What should I eat before a workout?',
  'How much water should I drink daily?',
  'What are good protein sources for vegetarians?'
];


const Message = ({ role, content, isTyping = false }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-3xl ${role === 'user' ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          role === 'user'
            ? 'bg-primary text-white ml-3'
            : 'bg-secondary text-white mr-3 dark:bg-secondary-600'
        }`}>
          {role === 'user' ? <BsPerson className="h-5 w-5" /> : <BsRobot className="h-5 w-5" />}
        </div>
        <div className={`px-4 py-3 rounded-2xl ${
          role === 'user'
            ? 'bg-primary/10 dark:bg-primary/20 text-gray-800 dark:text-gray-200 rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
        }`}>
          {isTyping ? (
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const VirtualCoachPage = () => {
  const dispatch = useDispatch();
  const { chatHistory, isTyping } = useSelector((state) => state.coach);
  const [inputValue, setInputValue] = useState('');


  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);


  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };


  const stopListening = () => {
    SpeechRecognition.stopListening();
  };


  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;


    const userMessage = {
      role: 'user',
      content: inputValue,
    };


    const updatedChatHistory = [...chatHistory, userMessage];
    dispatch(addUserMessage(userMessage));
    dispatch(sendMessage(updatedChatHistory));
    setInputValue('');
    resetTranscript();
  };


  const handleSuggestedQuestion = (question) => {
    const userMessage = {
      role: 'user',
      content: question,
    };
    const updatedChatHistory = [...chatHistory, userMessage];
    dispatch(addUserMessage(userMessage));
    dispatch(sendMessage(updatedChatHistory));
    resetTranscript();
  };


  const handleNewChat = () => {
    dispatch(resetChat());
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <IoChatbubbleOutline className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Virtual Nutrition Coach</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get personalized nutrition advice and support from our AI-powered virtual coach.
          </p>
        </motion.div>


        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <IoNutritionOutline className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Nutrition Coach</h2>
                <p className="text-white/80 text-xs">Always available</p>
              </div>
            </div>
            {chatHistory.length > 0 && (
              <button
                onClick={handleNewChat}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-md flex items-center transition-colors"
              >
                <IoChatbubbleOutline className="mr-1.5" />
                New Chat
              </button>
            )}
          </div>


          <div className="flex-1 p-6 overflow-y-auto">
            {!chatHistory.some(msg => msg.role === 'user') ? (
              <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                <div>
                  <p className="text-lg mb-4">Ask me anything about nutrition!</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="px-4 py-3 bg-white dark:bg-gray-700 rounded-lg text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 flex items-center"
                      >
                        <IoBulbOutline className="mr-2 text-yellow-500 flex-shrink-0" />
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <Message
                  key={index}
                  role={message.role}
                  content={message.content}
                  isTyping={isTyping && index === chatHistory.length - 1 && message.role === 'assistant'}
                />
              ))
            )}
          </div>


          <div className="border-t p-4 bg-gray-50 dark:bg-gray-700">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={listening ? "Listening..." : "Ask me anything about nutrition..."}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-l-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  disabled={isTyping}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {listening && (
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-1 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="h-2 w-1 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-1 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
              </div>


              {browserSupportsSpeechRecognition && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 ${listening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'} transition-colors`}
                  disabled={isTyping}
                  title={listening ? 'Stop listening' : 'Start voice input'}
                >
                  {listening ? (
                    <IoMicOff className="h-5 w-5 text-white" />
                  ) : (
                    <IoMic className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  )}
                </button>
              )}


              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary text-white p-3 rounded-r-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <IoSend className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>


        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <IoCheckmarkCircle className="h-5 w-5 text-green-500" />, text: 'Personalized nutrition advice' },
            { icon: <IoCheckmarkCircle className="h-5 w-5 text-green-500" />, text: 'Meal planning guidance' },
            { icon: <IoCheckmarkCircle className="h-5 w-5 text-green-500" />, text: '24/7 support' },
          ].map((tip, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start space-x-2">
              {tip.icon}
              <span className="text-sm text-gray-700 dark:text-gray-300">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default VirtualCoachPage;