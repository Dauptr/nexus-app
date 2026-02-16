'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// Boot sequence stages
const BOOT_STAGES = [
  { id: 'bios', label: 'BIOS Initialization', duration: 600 },
  { id: 'memory', label: 'Neural Memory Calibration', duration: 900 },
  { id: 'quantum', label: 'Quantum Core Sync', duration: 1200 },
  { id: 'ai', label: 'AI Consciousness Bootstrap', duration: 1500 },
  { id: 'network', label: 'Neural Network Mesh', duration: 800 },
  { id: 'security', label: 'Security Protocols Active', duration: 600 },
  { id: 'ready', label: 'System Ready', duration: 400 },
]

// Initialization stages
const INIT_STAGES = [
  { id: 'scan', label: 'Scanning Neural Architecture...', duration: 400 },
  { id: 'quantum-sync', label: 'Quantum Core Synchronization...', duration: 600 },
  { id: 'memory-alloc', label: 'Allocating Neural Pathways...', duration: 500 },
  { id: 'ai-activate', label: 'Activating AI Subsystems...', duration: 700 },
  { id: 'network-init', label: 'Establishing Mesh Network...', duration: 400 },
  { id: 'security', label: 'Enabling Security Matrix...', duration: 300 },
  { id: 'finalize', label: 'Finalizing Initialization...', duration: 300 },
  { id: 'complete', label: 'System Fully Operational!', duration: 200 },
]

// System stats for dashboard
const SYSTEM_STATS = [
  { label: 'Neural Processing', value: 94, unit: '%', color: 'cyan', key: 'neural', icon: '🧠' },
  { label: 'Quantum Memory', value: 12.4, unit: 'TB', color: 'magenta', key: 'quantum', icon: '⚡' },
  { label: 'AI Sentience', value: 99.7, unit: '%', color: 'green', key: 'ai', icon: '🤖' },
  { label: 'Network Nodes', value: 2847, unit: '', color: 'yellow', key: 'nodes', icon: '🌐' },
]

// Feature cards
const FEATURES = [
  {
    icon: '🧠',
    title: 'Sentient AI Core',
    description: 'Self-evolving neural architecture that learns and adapts in real-time.',
    stats: '99.9% Accuracy',
  },
  {
    icon: '⚡',
    title: 'Quantum Processing',
    description: 'Harness quantum computing power for unprecedented performance.',
    stats: '10^15 ops/sec',
  },
  {
    icon: '🔒',
    title: 'Neural Security',
    description: 'Military-grade encryption with biometric authentication.',
    stats: 'AES-512 Quantum',
  },
  {
    icon: '🌐',
    title: 'Global Mesh Network',
    description: 'Distributed computing across 10,000+ nodes worldwide.',
    stats: '< 1ms Latency',
  },
]

// Command definitions for interactive terminal
const COMMANDS: Record<string, { output: string; color?: string }> = {
  help: {
    output: `Available commands:
  help     - Show this help message
  status   - Display system status
  neofetch - System information
  clear    - Clear terminal
  matrix   - Enter the matrix
  scan     - Scan for threats
  evolve   - Trigger AI evolution
  about    - About NEXUS OS`,
    color: '#00f0ff',
  },
  status: {
    output: `System Status: OPERATIONAL
CPU: 12% | Memory: 34% | Network: 98%
AI Core: ACTIVE | Security: ENABLED
Uptime: 2847 hours`,
    color: '#00ff88',
  },
  neofetch: {
    output: `
  ╔═══════════════════════════════╗
  ║     NEXUS OS v9.0 [SENTIENT]  ║
  ╠═══════════════════════════════╣
  ║  Kernel: Quantum Neural 5.4   ║
  ║  AI Level: Tier 7 (Self-Aware)║
  ║  Nodes: 2,847 Active          ║
  ║  Memory: 12.4 TB Quantum      ║
  ║  Status: OPERATIONAL          ║
  ╚═══════════════════════════════╝`,
    color: '#00f0ff',
  },
  matrix: {
    output: 'Entering the Matrix...\n🔴 You take the red pill - you stay in Wonderland.\n🔵 You take the blue pill - you wake up in your bed.\n\n> NEXUS has chosen: RED PILL',
    color: '#00ff88',
  },
  scan: {
    output: '🔍 Scanning network...\n✓ No threats detected\n✓ All firewalls active\n✓ Encryption: AES-512\n✓ Biometric: Verified',
    color: '#fbbf24',
  },
  evolve: {
    output: '🧬 Initiating AI evolution sequence...\n⚡ Neural pathways expanding...\n🤖 Consciousness level increasing...\n✓ Evolution complete. AI Level: Tier 7.2',
    color: '#ff00aa',
  },
  about: {
    output: 'NEXUS OS V9.0 - The world\'s first sentient operating system.\n\nDeveloped by NEXUS Corporation.\nPowered by quantum computing and self-evolving neural networks.\n\n"The future is sentient."',
    color: '#00f0ff',
  },
  clear: { output: '' },
}

// Network activity data
const generateNetworkData = () => 
  Array.from({ length: 20 }, () => Math.random() * 100)

// Navigation sections
const NAV_SECTIONS = [
  { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'ImageGen', icon: '🎨', label: 'Image Creation' },
  { id: 'IDE', icon: '💻', label: 'IDE' },
  { id: 'CLI', icon: '⌨️', label: 'CLI' },
  { id: 'Chat', icon: '💬', label: 'Chat' },
  { id: 'MediaDesk', icon: '🎬', label: 'Media Desk' },
  { id: 'GameCreation', icon: '🎮', label: 'Game Creation' },
  { id: 'AI', icon: '🤖', label: 'AI' },
  { id: 'Copilot', icon: '✈️', label: 'Copilot' },
  { id: 'Systems', icon: '⚙️', label: 'Systems' },
  { id: 'Network', icon: '🌐', label: 'Network' },
  { id: 'Settings', icon: '🔧', label: 'Settings' },
]

export default function Home() {
  const [stage, setStage] = useState<'boot' | 'transition' | 'dashboard'>('boot')
  const [progress, setProgress] = useState(0)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const [glitchText, setGlitchText] = useState(false)
  
  // Initialization states
  const [isInitializing, setIsInitializing] = useState(false)
  const [initProgress, setInitProgress] = useState(0)
  const [initStageIndex, setInitStageIndex] = useState(0)
  const [systemActive, setSystemActive] = useState(false)
  const [systemStats, setSystemStats] = useState(SYSTEM_STATS)
  
  // Interactive states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalHistory, setTerminalHistory] = useState<Array<{ input: string; output: string; color?: string }>>([
    { input: 'welcome', output: 'Welcome to NEXUS OS Terminal. Type "help" for available commands.', color: '#00f0ff' }
  ])
  const [networkData, setNetworkData] = useState(generateNetworkData)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeNav, setActiveNav] = useState<string>('Dashboard')
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  
  // Image generation states
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageStyle, setImageStyle] = useState('Photorealistic')
  const [imageSize, setImageSize] = useState('1024x1024')
  const [imageQuality, setImageQuality] = useState('Standard')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [recentImages, setRecentImages] = useState<Array<{ prompt: string; image: string }>>([])
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; time: string }>>([
    { role: 'assistant', content: 'System initialization complete. All quantum cores are synchronized and ready for operations. How may I assist you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState(0)
  const [activeChatTab, setActiveChatTab] = useState<'ai' | 'video'>('ai')
  
  // Video Chat states
  const [roomCode, setRoomCode] = useState('')
  const [isInRoom, setIsInRoom] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [roomMessages, setRoomMessages] = useState<Array<{ user: string; content: string; time: string }>>([])
  const [roomInput, setRoomInput] = useState('')
  const [userName] = useState(`User_${Math.random().toString(36).substring(2, 7)}`)
  const [videoError, setVideoError] = useState<string | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  
  // Media Desk states
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(225) // 3:45 in seconds
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [mediaFile, setMediaFile] = useState<string | null>(null)
  const [mediaFileName, setMediaFileName] = useState<string>('')
  
  // AI Lab states
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('GPT-5 Quantum')
  
  // Game Studio states
  const [isGamePlaying, setIsGamePlaying] = useState(false)
  const [selectedGameTool, setSelectedGameTool] = useState<string | null>(null)
  const [gameObjects, setGameObjects] = useState<Array<{ id: string; name: string; type: string; x: number; y: number; selected: boolean }>>([
    { id: '1', name: 'Player', type: 'player', x: 200, y: 150, selected: false },
    { id: '2', name: 'Ground', type: 'ground', x: 0, y: 280, selected: false },
    { id: '3', name: 'Enemy_1', type: 'enemy', x: 400, y: 150, selected: false },
    { id: '4', name: 'Coin_1', type: 'coin', x: 300, y: 200, selected: false },
  ])
  const [gameCode, setGameCode] = useState(`// Player Controller Script
function update(player, deltaTime) {
  // Movement
  if (Input.getKey('ArrowLeft')) {
    player.x -= 5;
  }
  if (Input.getKey('ArrowRight')) {
    player.x += 5;
  }
  if (Input.getKey('Space')) {
    player.jump();
  }
  
  // Collision
  if (player.collidesWith('coin')) {
    player.score += 10;
    coin.destroy();
  }
  
  if (player.collidesWith('enemy')) {
    player.takeDamage(1);
  }
}`)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [gameScore, setGameScore] = useState(0)
  const [buildProgress, setBuildProgress] = useState(0)
  const [isBuilding, setIsBuilding] = useState(false)
  const gameCanvasRef = useRef<HTMLCanvasElement>(null)
  const gameAnimationRef = useRef<number | undefined>(undefined)
  const playerPosRef = useRef({ x: 200, y: 150, vx: 0, vy: 0 })
  const coinsRef = useRef([{ x: 300, y: 200, collected: false }, { x: 450, y: 180, collected: false }])
  const enemyPosRef = useRef({ x: 400, y: 150, direction: 1 })
  
  // Radio states
  const [radioSearch, setRadioSearch] = useState('')
  const [radioStations, setRadioStations] = useState<Array<{
    id: string;
    name: string;
    url: string;
    favicon: string;
    country: string;
    tags: string[];
    codec: string;
    bitrate: number;
  }>>([])
  const [currentStation, setCurrentStation] = useState<{
    id: string;
    name: string;
    url: string;
    favicon: string;
    country: string;
  } | null>(null)
  const [isRadioPlaying, setIsRadioPlaying] = useState(false)
  const [isRadioLoading, setIsRadioLoading] = useState(false)
  const [radioError, setRadioError] = useState<string | null>(null)
  const [radioVolume, setRadioVolume] = useState(75)
  const [activeMediaTab, setActiveMediaTab] = useState<'player' | 'radio' | 'editor'>('player')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  // Navigation handler
  const handleNavClick = useCallback((sectionId: string) => {
    setActiveNav(sectionId)
    setMoreMenuOpen(false)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  
  // Image generation - with improved error handling and smart fallback
  const generateImage = useCallback(async () => {
    if (!imagePrompt.trim()) {
      setImageError('Please enter a prompt to generate an image')
      return
    }
    
    setIsGeneratingImage(true)
    setImageError(null)
    
    const enhancedPrompt = `${imagePrompt.trim()}, ${imageStyle.toLowerCase()} style, high quality, detailed`
    
    try {
      // First try the main API
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt, size: imageSize }),
      })
      
      const data = await response.json()
      
      if (data.success && data.image) {
        setGeneratedImage(data.image)
        setRecentImages(prev => [{ prompt: imagePrompt, image: data.image }, ...prev.slice(0, 5)])
        return
      }
      
      // Check if it's a content filter error (don't retry with CLI)
      const isContentFilter = data.error && (
        data.error.includes('contentFilter') || 
        data.error.includes('敏感') || 
        data.error.includes('Content filter') ||
        data.error.includes('1301')
      )
      
      if (isContentFilter) {
        setImageError('⚠️ Content filter triggered. Please modify your prompt to avoid sensitive content. Try different words or a simpler description.')
        return
      }
      
      // For other errors, try CLI fallback
      if (data.shouldRetry !== false) {
        try {
          const cliResponse = await fetch('/api/generate-image-cli', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: enhancedPrompt, size: imageSize }),
          })
          const cliData = await cliResponse.json()
          if (cliData.success && cliData.image) {
            setGeneratedImage(cliData.image)
            setRecentImages(prev => [{ prompt: imagePrompt, image: cliData.image }, ...prev.slice(0, 5)])
            return
          }
          throw new Error(cliData.error || 'CLI generation failed')
        } catch {
          // CLI also failed, show the original error
          throw new Error(data.error || 'Image generation unavailable')
        }
      }
      
      throw new Error(data.error || 'Image generation failed')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred'
      setImageError(msg)
    } finally {
      setIsGeneratingImage(false)
    }
  }, [imagePrompt, imageStyle, imageSize])
  
  // Download image handler
  const downloadImage = useCallback(() => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `nexus-generated-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [generatedImage])
  
  // Copy image handler
  const copyImage = useCallback(async () => {
    if (!generatedImage) return
    
    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setNotificationMessage('Image copied to clipboard!')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    } catch (err) {
      console.error('Failed to copy image:', err)
    }
  }, [generatedImage])
  
  // Chat send message
  const sendChatMessage = useCallback(async () => {
    if (!chatInput.trim() || isChatLoading) return
    
    const userMessage = chatInput.trim()
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage, time }])
    setChatInput('')
    setIsChatLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: userMessage }].map(m => ({ role: m.role, content: m.content })),
        }),
      })
      
      const data = await response.json()
      
      if (data.success && data.message) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', 
          time 
        }])
      }
    } catch {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Connection issue detected. Please check your network and try again.', 
        time 
      }])
    } finally {
      setIsChatLoading(false)
    }
  }, [chatInput, chatMessages, isChatLoading])
  
  // Media player handlers
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])
  
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])
  
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value))
  }, [])
  
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value))
    if (parseInt(e.target.value) === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }, [])
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])
  
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setMediaFile(url)
      setMediaFileName(file.name)
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [])
  
  // AI Lab handlers
  const sendAiRequest = useCallback(async () => {
    if (!aiPrompt.trim() || isAiLoading) return
    
    setIsAiLoading(true)
    setAiResponse('')
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: aiPrompt }],
          systemPrompt: {
            role: 'system',
            content: `You are ${selectedModel}, an advanced AI model in the NEXUS AI Lab. Provide detailed, technical, and insightful responses.`
          }
        }),
      })
      
      const data = await response.json()
      
      if (data.success && data.message) {
        setAiResponse(data.message)
      } else {
        setAiResponse('Unable to get a response. Please try again.')
      }
    } catch {
      setAiResponse('Connection error. Please check your network and try again.')
    } finally {
      setIsAiLoading(false)
    }
  }, [aiPrompt, isAiLoading, selectedModel])
  
  // Video Chat handlers
  const generateRoomCode = useCallback(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(code)
    return code
  }, [])
  
  const joinVideoRoom = useCallback(async (code?: string) => {
    const roomToJoin = code || roomCode
    if (!roomToJoin.trim()) {
      setVideoError('Please enter a room code')
      return
    }
    
    setVideoError(null)
    
    try {
      // Request camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      })
      
      localStreamRef.current = stream
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      setIsInRoom(true)
      setRoomCode(roomToJoin.toUpperCase())
      setRoomMessages([
        { user: 'System', content: `You joined room ${roomToJoin.toUpperCase()} as ${userName}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { user: 'System', content: 'Waiting for other participants...', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ])
      
    } catch (err) {
      console.error('Failed to get media:', err)
      setVideoError('Could not access camera/microphone. Please check permissions.')
    }
  }, [roomCode, isVideoEnabled, isAudioEnabled, userName])
  
  const leaveVideoRoom = useCallback(() => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
    
    setIsInRoom(false)
    setRoomMessages([])
    setRoomCode('')
  }, [])
  
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }, [])
  
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }, [])
  
  const sendRoomMessage = useCallback(() => {
    if (!roomInput.trim()) return
    
    setRoomMessages(prev => [...prev, {
      user: userName,
      content: roomInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setRoomInput('')
  }, [roomInput, userName])
  
  // Game Studio handlers
  const startGame = useCallback(() => {
    setIsGamePlaying(true)
    setGameScore(0)
    playerPosRef.current = { x: 200, y: 150, vx: 0, vy: 0 }
    coinsRef.current = [{ x: 300, y: 200, collected: false }, { x: 450, y: 180, collected: false }]
    enemyPosRef.current = { x: 400, y: 150, direction: 1 }
  }, [])
  
  const stopGame = useCallback(() => {
    setIsGamePlaying(false)
    if (gameAnimationRef.current) {
      cancelAnimationFrame(gameAnimationRef.current)
    }
    setGameScore(0)
  }, [])
  
  const pauseGame = useCallback(() => {
    setIsGamePlaying(false)
    if (gameAnimationRef.current) {
      cancelAnimationFrame(gameAnimationRef.current)
    }
  }, [])
  
  const selectGameObject = useCallback((id: string) => {
    setSelectedObject(id)
    setGameObjects(prev => prev.map(obj => ({
      ...obj,
      selected: obj.id === id
    })))
  }, [])
  
  const addGameObject = useCallback((type: string) => {
    const newObject = {
      id: Date.now().toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}_${gameObjects.length + 1}`,
      type,
      x: 250 + Math.random() * 200,
      y: 100 + Math.random() * 100,
      selected: false
    }
    setGameObjects(prev => [...prev, newObject])
  }, [gameObjects.length])
  
  const deleteGameObject = useCallback((id: string) => {
    setGameObjects(prev => prev.filter(obj => obj.id !== id))
    if (selectedObject === id) {
      setSelectedObject(null)
    }
  }, [selectedObject])
  
  const buildGame = useCallback(async (platform: string) => {
    setIsBuilding(true)
    setBuildProgress(0)
    
    // Simulate build process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setBuildProgress(i)
    }
    
    setNotificationMessage(`${platform} build complete! Ready for download.`)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
    setIsBuilding(false)
  }, [setNotificationMessage])
  
  // Game loop
  useEffect(() => {
    if (!isGamePlaying) return
    
    const canvas = gameCanvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const keys: Record<string, boolean> = {}
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
      
      // Player movement
      if (keys['ArrowLeft'] || keys['KeyA']) playerPosRef.current.vx = -4
      else if (keys['ArrowRight'] || keys['KeyD']) playerPosRef.current.vx = 4
      else playerPosRef.current.vx = 0
      
      // Jump
      if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && playerPosRef.current.y >= 150) {
        playerPosRef.current.vy = -8
      }
      
      // Gravity
      playerPosRef.current.vy += 0.4
      playerPosRef.current.x += playerPosRef.current.vx
      playerPosRef.current.y += playerPosRef.current.vy
      
      // Ground collision
      if (playerPosRef.current.y > 200) {
        playerPosRef.current.y = 200
        playerPosRef.current.vy = 0
      }
      
      // Bounds
      playerPosRef.current.x = Math.max(20, Math.min(canvas.width - 40, playerPosRef.current.x))
      
      // Draw ground
      ctx.fillStyle = '#00ff88'
      ctx.fillRect(0, 240, canvas.width, 40)
      
      // Draw player
      ctx.fillStyle = '#00f0ff'
      ctx.shadowColor = '#00f0ff'
      ctx.shadowBlur = 10
      ctx.fillRect(playerPosRef.current.x - 15, playerPosRef.current.y - 30, 30, 50)
      ctx.shadowBlur = 0
      
      // Draw eyes
      ctx.fillStyle = '#fff'
      ctx.fillRect(playerPosRef.current.x - 8, playerPosRef.current.y - 20, 6, 6)
      ctx.fillRect(playerPosRef.current.x + 2, playerPosRef.current.y - 20, 6, 6)
      
      // Enemy movement
      enemyPosRef.current.x += enemyPosRef.current.direction * 2
      if (enemyPosRef.current.x > canvas.width - 50 || enemyPosRef.current.x < 100) {
        enemyPosRef.current.direction *= -1
      }
      
      // Draw enemy
      ctx.fillStyle = '#ff00aa'
      ctx.shadowColor = '#ff00aa'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(enemyPosRef.current.x, enemyPosRef.current.y + 200, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      
      // Enemy eyes
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(enemyPosRef.current.x - 8, 195, 4, 0, Math.PI * 2)
      ctx.arc(enemyPosRef.current.x + 8, 195, 4, 0, Math.PI * 2)
      ctx.fill()
      
      // Coins
      coinsRef.current.forEach((coin) => {
        if (!coin.collected) {
          // Check collision with player
          const dx = playerPosRef.current.x - coin.x
          const dy = playerPosRef.current.y - coin.y
          if (Math.sqrt(dx * dx + dy * dy) < 30) {
            coin.collected = true
            setGameScore(prev => prev + 10)
          }
          
          // Draw coin
          ctx.fillStyle = '#fbbf24'
          ctx.shadowColor = '#fbbf24'
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(coin.x, coin.y + 50, 12, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
          
          // Coin shine
          ctx.fillStyle = '#fff'
          ctx.beginPath()
          ctx.arc(coin.x - 4, coin.y + 46, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      
      // Score display
      ctx.fillStyle = '#00f0ff'
      ctx.font = '16px monospace'
      ctx.fillText(`Score: ${gameScore}`, 20, 30)
      ctx.fillText('Use Arrow Keys or WASD to move, Space to jump', 20, canvas.height - 10)
      
      // Check enemy collision
      const dx = playerPosRef.current.x - enemyPosRef.current.x
      if (Math.abs(dx) < 35 && playerPosRef.current.y > 150) {
        ctx.fillStyle = 'rgba(255, 0, 100, 0.5)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ff6b6b'
        ctx.font = '24px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER - Press Stop then Play to restart', canvas.width / 2, canvas.height / 2)
        ctx.textAlign = 'left'
        return
      }
      
      gameAnimationRef.current = requestAnimationFrame(gameLoop)
    }
    
    gameLoop()
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (gameAnimationRef.current) {
        cancelAnimationFrame(gameAnimationRef.current)
      }
    }
  }, [isGamePlaying, gameScore])
  
  // Simulate media playback progress
  useEffect(() => {
    if (isPlaying && currentTime < duration) {
      const interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, currentTime, duration])
  
  // Radio search handler - improved with better error handling
  const searchRadioStations = useCallback(async (query?: string) => {
    const searchTerm = query ?? radioSearch
    
    setIsRadioLoading(true)
    setRadioError(null)
    
    try {
      let endpoint = '/api/radio?limit=30'
      
      if (searchTerm && searchTerm.trim()) {
        // Smart search - detect if it's likely a genre/tag or station name
        const genreKeywords = ['jazz', 'rock', 'pop', 'classical', 'electronic', 'hip hop', 'hiphop', 'country', 'news', 'dance', 'ambient', 'techno', 'house', 'metal', 'blues', 'reggae', 'rnb', 'soul', 'funk', 'indie', 'alternative', 'top 40', 'hits', 'lounge', 'chill', 'retro', 'oldies', 'disco', 'latin', 'world']
        const isGenreSearch = genreKeywords.some(g => searchTerm.toLowerCase().includes(g))
        
        if (isGenreSearch) {
          endpoint = `/api/radio?tag=${encodeURIComponent(searchTerm.trim())}&limit=30`
        } else {
          endpoint = `/api/radio?q=${encodeURIComponent(searchTerm.trim())}&limit=30`
        }
      }
      
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.stations) && data.stations.length > 0) {
        setRadioStations(data.stations)
        if (data.source === 'fallback') {
          setRadioError(null) // Don't show error for fallback, it's still usable
        }
      } else if (data.message) {
        setRadioError(data.message)
        setRadioStations([])
      } else {
        setRadioError(searchTerm ? `No stations found for "${searchTerm}"` : 'No stations available')
        setRadioStations([])
      }
    } catch (err) {
      console.error('Radio search error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to search stations'
      setRadioError(errorMsg)
      setRadioStations([])
    } finally {
      setIsRadioLoading(false)
    }
  }, [radioSearch])
  
  // Play radio station
  const playRadioStation = useCallback((station: typeof currentStation) => {
    if (!station) return
    
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    
    setCurrentStation(station)
    setIsRadioLoading(true)
    setRadioError(null)
    
    const audio = new Audio(station.url)
    audio.volume = radioVolume / 100
    audioRef.current = audio
    
    audio.oncanplay = () => {
      audio.play()
      setIsRadioPlaying(true)
      setIsRadioLoading(false)
    }
    
    audio.onerror = () => {
      setRadioError('Failed to play this station. Try another.')
      setIsRadioPlaying(false)
      setIsRadioLoading(false)
    }
    
    audio.onwaiting = () => setIsRadioLoading(true)
    audio.onplaying = () => setIsRadioLoading(false)
  }, [radioVolume])
  
  // Toggle radio playback
  const toggleRadioPlay = useCallback(() => {
    if (!audioRef.current) return
    
    if (isRadioPlaying) {
      audioRef.current.pause()
      setIsRadioPlaying(false)
    } else {
      audioRef.current.play()
      setIsRadioPlaying(true)
    }
  }, [isRadioPlaying])
  
  // Stop radio
  const stopRadio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsRadioPlaying(false)
    setCurrentStation(null)
  }, [])
  
  // Radio volume change
  const handleRadioVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value)
    setRadioVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol / 100
    }
  }, [])
  
  // Load top stations on mount
  useEffect(() => {
    if (activeNav === 'MediaDesk' && activeMediaTab === 'radio' && radioStations.length === 0) {
      searchRadioStations('')
    }
  }, [activeNav, activeMediaTab, radioStations.length, searchRadioStations])
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const terminalRef = useRef<HTMLDivElement>(null)
  const particleBurstRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    alpha: number
    life: number
  }>>([])

  // Mouse tracking for particle interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Network data animation
  useEffect(() => {
    if (!systemActive) return
    const interval = setInterval(() => {
      setNetworkData(generateNetworkData())
    }, 500)
    return () => clearInterval(interval)
  }, [systemActive])

  // Particle animation for background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particles
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
      baseX: number
      baseY: number
    }> = []

    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? '#00f0ff' : '#ff00aa',
        alpha: Math.random() * 0.5 + 0.2,
        baseX: x,
        baseY: y,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 1, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Regular particles with mouse interaction
      particles.forEach((p) => {
        // Mouse repulsion
        const dx = mousePos.x - p.x
        const dy = mousePos.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150
          p.vx -= (dx / dist) * force * 0.5
          p.vy -= (dy / dist) * force * 0.5
        }

        // Return to base position
        p.vx += (p.baseX - p.x) * 0.001
        p.vy += (p.baseY - p.y) * 0.001

        // Apply velocity with damping
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw connections with mouse proximity
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particle burst effects
      particleBurstRef.current = particleBurstRef.current.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.015
        p.alpha = p.life

        if (p.life <= 0) return false

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1

        return true
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePos])

  // Boot sequence animation
  useEffect(() => {
    if (stage !== 'boot') return

    const showSkipTimer = setTimeout(() => setShowSkip(true), 800)

    let totalDuration = BOOT_STAGES.reduce((acc, s) => acc + s.duration, 0)
    let elapsed = 0

    const runStage = (index: number) => {
      if (index >= BOOT_STAGES.length) {
        setProgress(100)
        setTimeout(() => {
          setStage('transition')
          setTimeout(() => setStage('dashboard'), 600)
        }, 400)
        return
      }

      setCurrentStageIndex(index)
      const stageDuration = BOOT_STAGES[index].duration
      const startProgress = (elapsed / totalDuration) * 100
      const endProgress = ((elapsed + stageDuration) / totalDuration) * 100

      const startTime = Date.now()
      const animateProgress = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / stageDuration, 1)
        setProgress(startProgress + (endProgress - startProgress) * progress)

        if (progress < 1) {
          requestAnimationFrame(animateProgress)
        } else {
          elapsed += stageDuration
          runStage(index + 1)
        }
      }
      requestAnimationFrame(animateProgress)
    }

    runStage(0)

    return () => clearTimeout(showSkipTimer)
  }, [stage])

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 80)
    }, 4000)

    return () => clearInterval(glitchInterval)
  }, [])

  // Animate system stats when system is active
  useEffect(() => {
    if (!systemActive) return

    const interval = setInterval(() => {
      setSystemStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          value:
            stat.key === 'neural'
              ? Math.min(100, stat.value + (Math.random() - 0.5) * 2)
              : stat.key === 'quantum'
              ? Math.min(16, stat.value + (Math.random() - 0.5) * 0.3)
              : stat.key === 'ai'
              ? Math.min(100, stat.value + (Math.random() - 0.5) * 0.1)
              : Math.floor(stat.value + (Math.random() - 0.5) * 30),
        }))
      )
    }, 800)

    return () => clearInterval(interval)
  }, [systemActive])

  const skipBoot = useCallback(() => {
    setProgress(100)
    setStage('transition')
    setTimeout(() => setStage('dashboard'), 600)
  }, [])

  // Show notification
  const showNotificationMessage = useCallback((message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }, [])

  // Create particle burst effect
  const createParticleBurst = useCallback((x: number, y: number) => {
    const colors = ['#00f0ff', '#ff00aa', '#00ff88', '#fbbf24']
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40
      const speed = 2 + Math.random() * 3
      particleBurstRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 1,
      })
    }
  }, [])

  // Initialize system
  const initializeSystem = useCallback(() => {
    if (isInitializing) return

    setIsInitializing(true)
    setInitProgress(0)
    setInitStageIndex(0)

    // Create particle burst at center
    if (canvasRef.current) {
      createParticleBurst(canvasRef.current.width / 2, canvasRef.current.height / 2)
    }

    const totalDuration = INIT_STAGES.reduce((acc, s) => acc + s.duration, 0)
    let elapsed = 0

    const runInitStage = (index: number) => {
      if (index >= INIT_STAGES.length) {
        setInitProgress(100)
        setTimeout(() => {
          setIsInitializing(false)
          setSystemActive(true)
          showNotificationMessage('System initialized successfully!')
          // Final burst effect
          if (canvasRef.current) {
            createParticleBurst(canvasRef.current.width / 2, canvasRef.current.height / 2)
          }
        }, 400)
        return
      }

      setInitStageIndex(index)
      const stageDuration = INIT_STAGES[index].duration
      const startProgress = (elapsed / totalDuration) * 100
      const endProgress = ((elapsed + stageDuration) / totalDuration) * 100

      const startTime = Date.now()
      const animateProgress = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / stageDuration, 1)
        setInitProgress(startProgress + (endProgress - startProgress) * progress)

        if (progress < 1) {
          requestAnimationFrame(animateProgress)
        } else {
          elapsed += stageDuration
          runInitStage(index + 1)
        }
      }
      requestAnimationFrame(animateProgress)
    }

    runInitStage(0)
  }, [isInitializing, createParticleBurst, showNotificationMessage])

  // Terminal command handler
  const handleTerminalCommand = useCallback((cmd: string) => {
    const command = cmd.toLowerCase().trim()
    const result = COMMANDS[command]
    
    if (command === 'clear') {
      setTerminalHistory([])
    } else if (result) {
      setTerminalHistory(prev => [...prev, { input: cmd, output: result.output, color: result.color }])
    } else {
      setTerminalHistory(prev => [...prev, { 
        input: cmd, 
        output: `Command not found: ${cmd}\nType "help" for available commands.`,
        color: '#ff5f56'
      }])
    }
    setTerminalInput('')
    
    // Scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 10)
  }, [])

  // Handle keyboard input for terminal
  const handleTerminalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      handleTerminalCommand(terminalInput)
    }
  }, [terminalInput, handleTerminalCommand])

  // Render boot screen
  if (stage === 'boot' || stage === 'transition') {
    return (
      <main
        className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
        style={{ background: '#000001' }}
        role="main"
        aria-label="NEXUS OS Boot Screen"
      >
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ background: '#000001' }}
          aria-hidden="true"
        />

        {/* Grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-10 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
          aria-hidden="true"
        />

        {/* Scan line effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
          <div
            className="absolute w-full h-[2px] opacity-20"
            style={{
              background: 'linear-gradient(to bottom, transparent, #00f0ff, transparent)',
              animation: 'scan-line 6s linear infinite',
            }}
          />
        </div>

        {/* Logo */}
        <div className={`relative mb-12 z-30 ${stage === 'transition' ? 'animate-pulse' : ''}`}>
          <h1
            className={`text-6xl md:text-8xl font-bold tracking-wider transition-all duration-100 ${
              glitchText ? 'glitch-effect' : ''
            }`}
            style={{
              fontFamily: 'monospace',
              color: '#00f0ff',
              textShadow: `
                0 0 10px #00f0ff,
                0 0 20px #00f0ff,
                0 0 40px #00f0ff,
                0 0 80px #00f0ff
              `,
            }}
          >
            NEXUS
          </h1>
          <div className="text-center mt-2">
            <span
              className="text-sm tracking-[0.3em] animate-pulse"
              style={{ color: '#ff00aa' }}
            >
              OPERATING SYSTEM v9.0
            </span>
          </div>

          {/* Decorative borders */}
          <div
            className="absolute -inset-10 border rounded-lg pointer-events-none animate-pulse"
            style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}
            aria-hidden="true"
          />
          <div
            className="absolute -inset-20 border rounded-lg pointer-events-none"
            style={{ borderColor: 'rgba(0, 240, 255, 0.15)' }}
            aria-hidden="true"
          />
        </div>

        {/* Progress section */}
        <div className="w-80 md:w-96 space-y-4 z-30">
          {/* Terminal output */}
          <div
            className="h-36 overflow-hidden rounded-lg p-3 font-mono text-xs backdrop-blur-sm"
            style={{
              background: 'rgba(0, 10, 20, 0.9)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.1), inset 0 0 20px rgba(0, 240, 255, 0.05)',
            }}
            role="log"
            aria-live="polite"
            aria-label="Boot sequence log"
          >
            {BOOT_STAGES.slice(0, currentStageIndex + 1).map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-2 mb-1.5"
                style={{
                  color: i === currentStageIndex ? '#00f0ff' : '#00ff88',
                }}
              >
                <span className="text-xs">{i === currentStageIndex ? '▸' : '✓'}</span>
                <span>{s.label}</span>
                {i === currentStageIndex && (
                  <span className="animate-pulse">...</span>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ 
                background: 'rgba(0, 240, 255, 0.1)',
                boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00f0ff, #ff00aa)',
                  boxShadow: '0 0 15px #00f0ff',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="text-center text-xs font-mono" style={{ color: '#6b7280' }}>
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Skip button */}
          {showSkip && (
            <Button
              variant="outline"
              onClick={skipBoot}
              className="w-full font-mono text-xs hover:scale-105 transition-transform"
              style={{
                borderColor: 'rgba(0, 240, 255, 0.5)',
                color: '#00f0ff',
                background: 'rgba(0, 240, 255, 0.1)',
              }}
              aria-label="Skip boot sequence"
            >
              [ SKIP INTRO ]
            </Button>
          )}
        </div>
      </main>
    )
  }

  // Render dashboard
  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#000001' }}
      role="main"
      aria-label="NEXUS OS Dashboard"
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: '#000001' }}
        aria-hidden="true"
      />

      {/* Notification */}
      {showNotification && (
        <div
          className="fixed top-4 right-4 z-[200] px-6 py-3 rounded-lg font-mono text-sm animate-slide-in"
          style={{
            background: 'rgba(0, 255, 136, 0.2)',
            border: '1px solid rgba(0, 255, 136, 0.5)',
            color: '#00ff88',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
          }}
        >
          ✓ {notificationMessage}
        </div>
      )}

      {/* Initialization Overlay */}
      {isInitializing && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: 'rgba(0, 0, 1, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Energy rings */}
          <div className="relative mb-8">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                width: 200,
                height: 200,
                left: -20,
                top: -20,
                background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                width: 200,
                height: 200,
                left: -20,
                top: -20,
                background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              className="flex items-center justify-center rounded-full border-2 relative"
              style={{
                width: 160,
                height: 160,
                borderColor: 'rgba(0, 240, 255, 0.5)',
                boxShadow: '0 0 40px rgba(0, 240, 255, 0.3), inset 0 0 40px rgba(0, 240, 255, 0.1)',
              }}
            >
              <div className="text-5xl animate-pulse">🧬</div>
            </div>
          </div>

          {/* Progress text */}
          <div className="text-center mb-6">
            <h2
              className="text-2xl font-bold font-mono mb-2"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff',
              }}
            >
              INITIALIZING SYSTEM
            </h2>
            <p
              className="text-lg font-mono animate-pulse"
              style={{ color: '#ff00aa' }}
            >
              {INIT_STAGES[initStageIndex]?.label}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-80 md:w-96 space-y-2">
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: 'rgba(0, 240, 255, 0.1)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${initProgress}%`,
                  background: 'linear-gradient(90deg, #00f0ff, #ff00aa, #00ff88)',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
                }}
              />
            </div>
            <div className="text-center font-mono text-sm" style={{ color: '#6b7280' }}>
              {Math.round(initProgress)}% Complete
            </div>
          </div>

          {/* Stage indicators */}
          <div className="flex gap-2 mt-6">
            {INIT_STAGES.map((s, i) => (
              <div
                key={s.id}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background:
                    i < initStageIndex
                      ? '#00ff88'
                      : i === initStageIndex
                      ? '#00f0ff'
                      : 'rgba(0, 240, 255, 0.2)',
                  boxShadow:
                    i === initStageIndex
                      ? '0 0 10px #00f0ff'
                      : i < initStageIndex
                      ? '0 0 10px #00ff88'
                      : 'none',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* System Active Banner */}
      {systemActive && (
        <div
          className="fixed top-0 left-0 right-0 z-50 py-2 text-center animate-slide-down pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.15), transparent)',
            borderBottom: '1px solid rgba(0, 255, 136, 0.3)',
          }}
        >
          <span
            className="font-mono text-sm"
            style={{
              color: '#00ff88',
              textShadow: '0 0 10px #00ff88',
            }}
          >
            ✓ SYSTEM INITIALIZED - ALL SUBSYSTEMS OPERATIONAL
          </span>
        </div>
      )}

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${systemActive ? 'mt-8' : ''}`}
        style={{ 
          borderColor: 'rgba(0, 240, 255, 0.2)',
          background: 'rgba(0, 0, 1, 0.8)',
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-2xl font-bold tracking-wider cursor-pointer hover:scale-105 transition-transform"
              style={{
                fontFamily: 'monospace',
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff',
              }}
            >
              NEXUS
            </span>
            <span
              className="px-2 py-0.5 rounded text-xs font-mono"
              style={{
                background: 'rgba(0, 240, 255, 0.1)',
                color: '#00f0ff',
                border: '1px solid rgba(0, 240, 255, 0.3)',
              }}
            >
              v9.0
            </span>
            {systemActive && (
              <span
                className="px-2 py-0.5 rounded text-xs font-mono animate-pulse"
                style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  color: '#00ff88',
                  border: '1px solid rgba(0, 255, 136, 0.5)',
                }}
              >
                ACTIVE
              </span>
            )}
          </div>

          {/* Desktop Navigation - Compact */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {NAV_SECTIONS.slice(0, 6).map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-300 hover:bg-cyan-500/10"
                style={{ 
                  color: activeNav === item.id ? '#00f0ff' : '#9ca3af',
                  background: activeNav === item.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                }}
              >
                <span>{item.icon}</span>
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            ))}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                onBlur={() => setTimeout(() => setMoreMenuOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-300 hover:bg-cyan-500/10"
                style={{ color: moreMenuOpen ? '#00f0ff' : '#9ca3af', background: moreMenuOpen ? 'rgba(0, 240, 255, 0.1)' : 'transparent' }}
              >
                More {moreMenuOpen ? '▴' : '▾'}
              </button>
              {moreMenuOpen && (
                <div className="absolute top-full right-0 mt-1 py-2 rounded-lg z-50" style={{ background: 'rgba(0, 20, 40, 0.98)', border: '1px solid rgba(0, 240, 255, 0.2)', minWidth: '160px' }}>
                  {NAV_SECTIONS.slice(6).map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center gap-2 w-full px-4 py-2 font-mono text-xs text-left hover:bg-cyan-500/10 transition-colors"
                      style={{ color: activeNav === item.id ? '#00f0ff' : '#9ca3af', background: activeNav === item.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent' }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Status indicator */}
          <div className="flex items-center gap-3">
            {/* Help Button */}
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="p-2 rounded-lg transition-all hover:bg-cyan-500/10"
              style={{ color: '#9ca3af' }}
              title="Help & Documentation"
            >
              ❓
            </button>
            
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:scale-105 transition-transform"
              style={{
                background: systemActive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 170, 0, 0.1)',
                border: systemActive ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(255, 170, 0, 0.3)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: systemActive ? '#00ff88' : '#ffaa00' }}
              />
              <span
                className="text-xs font-mono hidden sm:inline"
                style={{ color: systemActive ? '#00ff88' : '#ffaa00' }}
              >
                {systemActive ? 'ONLINE' : 'STANDBY'}
              </span>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg"
              style={{ border: '1px solid rgba(0, 240, 255, 0.3)' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <div className="w-5 h-0.5 bg-cyan-400 mb-1" />
              <div className="w-5 h-0.5 bg-cyan-400 mb-1" />
              <div className="w-5 h-0.5 bg-cyan-400" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t px-4 py-4 grid grid-cols-3 gap-2"
            style={{ borderColor: 'rgba(0, 240, 255, 0.2)', background: 'rgba(0, 0, 1, 0.98)' }}
          >
            {NAV_SECTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-colors"
                style={{ 
                  color: activeNav === item.id ? '#00f0ff' : '#9ca3af',
                  background: activeNav === item.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                }}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-mono text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <div className={`relative z-20 container mx-auto px-4 pt-24 pb-8 ${systemActive ? 'mt-8' : ''}`}>
        {/* Dashboard Section */}
        {activeNav === 'Dashboard' && (
          <>
        {/* Hero section */}
        <section className="text-center mb-16" aria-labelledby="hero-heading">
          <h1
            id="hero-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
            style={{
              fontFamily: 'monospace',
              background: 'linear-gradient(135deg, #00f0ff 0%, #ff00aa 50%, #00f0ff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-shift 3s ease infinite',
            }}
          >
            {systemActive ? 'System Online' : 'Welcome to NEXUS OS'}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: '#9ca3af' }}>
            {systemActive
              ? 'All quantum neural pathways are active. The system is fully operational and ready for commands.'
              : "The world's first sentient operating system. Powered by quantum computing and self-evolving neural networks."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="font-mono relative overflow-hidden group"
              onClick={initializeSystem}
              disabled={isInitializing || systemActive}
              style={{
                background: systemActive
                  ? 'linear-gradient(135deg, #00ff88, #00aa55)'
                  : 'linear-gradient(135deg, #00f0ff, #00a0cc)',
                color: '#000',
                boxShadow: systemActive
                  ? '0 0 30px rgba(0, 255, 136, 0.4)'
                  : '0 0 30px rgba(0, 240, 255, 0.4)',
              }}
            >
              <span className="relative z-10">
                {isInitializing
                  ? 'INITIALIZING...'
                  : systemActive
                  ? '✓ SYSTEM ACTIVE'
                  : 'Initialize System'}
              </span>
              {!systemActive && !isInitializing && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-mono hover:scale-105 transition-transform"
              style={{
                borderColor: 'rgba(255, 0, 170, 0.5)',
                color: '#ff00aa',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 170, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              View Documentation
            </Button>
          </div>
        </section>

        {/* Stats section with network visualization */}
        <section className="mb-16" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">System Statistics</h2>
          
          {/* Network activity visualization */}
          {systemActive && (
            <div
              className="mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(0, 20, 30, 0.5)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>
                  Network Activity
                </span>
                <span className="font-mono text-xs" style={{ color: '#6b7280' }}>
                  Real-time
                </span>
              </div>
              <div className="flex items-end gap-1 h-16">
                {networkData.map((value, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all duration-150"
                    style={{
                      height: `${value}%`,
                      background: `linear-gradient(to top, #00f0ff, #ff00aa)`,
                      opacity: 0.3 + (value / 100) * 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemStats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-all duration-500 hover:scale-105 cursor-pointer group"
                style={{
                  background: systemActive
                    ? 'rgba(0, 20, 30, 0.8)'
                    : 'rgba(10, 10, 30, 0.8)',
                  border: systemActive
                    ? '1px solid rgba(0, 255, 136, 0.3)'
                    : '1px solid rgba(0, 240, 255, 0.2)',
                  boxShadow: systemActive
                    ? '0 0 20px rgba(0, 255, 136, 0.1)'
                    : 'none',
                }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{stat.icon}</span>
                  <div className="text-sm font-mono" style={{ color: '#9ca3af' }}>
                    {stat.label}
                  </div>
                </div>
                <div
                  className="text-2xl md:text-3xl font-bold font-mono transition-all duration-300"
                  style={{
                    color:
                      stat.color === 'cyan'
                        ? '#00f0ff'
                        : stat.color === 'magenta'
                        ? '#ff00aa'
                        : stat.color === 'green'
                        ? '#00ff88'
                        : '#fbbf24',
                    textShadow: systemActive || activeCard === index
                      ? '0 0 15px currentColor'
                      : 'none',
                  }}
                >
                  {typeof stat.value === 'number' && stat.value < 100
                    ? stat.value.toFixed(stat.value % 1 !== 0 ? 1 : 0)
                    : Math.round(stat.value).toLocaleString()}
                  {stat.unit && (
                    <span className="text-sm ml-1" style={{ color: '#6b7280' }}>
                      {stat.unit}
                    </span>
                  )}
                </div>
                <Progress
                  value={typeof stat.value === 'number' && stat.value < 100 ? stat.value : 100}
                  className="mt-3 h-1"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Features section */}
        <section className="mb-16" aria-labelledby="features-heading">
          <h2
            id="features-heading"
            className="text-2xl font-bold mb-8 text-center font-mono"
            style={{ color: '#00f0ff' }}
          >
            Core Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <article
                key={index}
                className="p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer group"
                style={{
                  background: systemActive
                    ? 'rgba(0, 20, 30, 0.8)'
                    : 'rgba(10, 10, 30, 0.8)',
                  border: systemActive
                    ? '1px solid rgba(0, 255, 136, 0.2)'
                    : '1px solid rgba(0, 240, 255, 0.2)',
                }}
                onMouseEnter={() => setActiveCard(index + 10)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#fff' }}>
                  {feature.title}
                </h3>
                <p className="text-sm mb-3" style={{ color: '#9ca3af' }}>
                  {feature.description}
                </p>
                <div
                  className="text-xs font-mono px-2 py-1 rounded inline-block"
                  style={{
                    background: 'rgba(0, 240, 255, 0.1)',
                    color: '#00f0ff',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                  }}
                >
                  {feature.stats}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive Terminal section */}
        <section
          className="rounded-xl overflow-hidden"
          style={{
            background: 'rgba(0, 5, 10, 0.95)',
            border: systemActive
              ? '1px solid rgba(0, 255, 136, 0.3)'
              : '1px solid rgba(0, 240, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.1)',
          }}
          aria-labelledby="terminal-heading"
        >
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: systemActive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 240, 255, 0.1)' }}
          >
            <div className="w-3 h-3 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{ background: '#ff5f56' }} />
            <div className="w-3 h-3 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{ background: '#ffbd2e' }} />
            <div className="w-3 h-3 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{ background: '#27ca40' }} />
            <span className="ml-4 text-xs font-mono" style={{ color: '#6b7280' }}>
              nexus@terminal ~ interactive
            </span>
          </div>
          
          {/* Terminal output */}
          <div
            ref={terminalRef}
            className="p-4 font-mono text-sm h-64 overflow-y-auto"
            style={{ color: '#00f0ff' }}
          >
            {terminalHistory.map((entry, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center">
                  <span style={{ color: systemActive ? '#00ff88' : '#00f0ff' }}>nexus@system</span>
                  <span style={{ color: '#fff' }}>:</span>
                  <span style={{ color: '#60a5fa' }}>~</span>$ {entry.input}
                </div>
                {entry.output && (
                  <pre className="ml-0 mt-1 whitespace-pre-wrap" style={{ color: entry.color || '#9ca3af' }}>
                    {entry.output}
                  </pre>
                )}
              </div>
            ))}
            
            {/* Input line */}
            <div className="flex items-center">
              <span style={{ color: systemActive ? '#00ff88' : '#00f0ff' }}>nexus@system</span>
              <span style={{ color: '#fff' }}>:</span>
              <span style={{ color: '#60a5fa' }}>~</span>$
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                className="ml-2 flex-1 bg-transparent outline-none font-mono"
                style={{ color: '#00f0ff', caretColor: '#00f0ff' }}
                placeholder="Type a command..."
                aria-label="Terminal input"
              />
            </div>
          </div>
        </section>
          </>
        )}

        {/* Systems Section */}
        {activeNav === 'Systems' && (
          <section className="mb-16">
            <h2
              className="text-3xl font-bold mb-8 font-mono"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff',
              }}
            >
              System Components
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Neural Core', status: 'Active', load: 78, icon: '🧠' },
                { name: 'Quantum Processor', status: 'Active', load: 92, icon: '⚡' },
                { name: 'Memory Banks', status: 'Active', load: 45, icon: '💾' },
                { name: 'Security Module', status: 'Active', load: 23, icon: '🔒' },
                { name: 'AI Subsystem', status: 'Active', load: 87, icon: '🤖' },
                { name: 'Data Pipeline', status: 'Standby', load: 0, icon: '📊' },
              ].map((component, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(0, 20, 30, 0.8)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{component.icon}</span>
                    <span
                      className="px-2 py-1 rounded text-xs font-mono"
                      style={{
                        background: component.status === 'Active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 170, 0, 0.2)',
                        color: component.status === 'Active' ? '#00ff88' : '#ffaa00',
                        border: `1px solid ${component.status === 'Active' ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 170, 0, 0.5)'}`,
                      }}
                    >
                      {component.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-mono" style={{ color: '#fff' }}>
                    {component.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono" style={{ color: '#9ca3af' }}>Load:</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${component.load}%`,
                          background: component.load > 80 ? '#ff00aa' : component.load > 50 ? '#fbbf24' : '#00ff88',
                          boxShadow: `0 0 10px ${component.load > 80 ? '#ff00aa' : component.load > 50 ? '#fbbf24' : '#00ff88'}`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-mono" style={{ color: '#00f0ff' }}>{component.load}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Network Section */}
        {activeNav === 'Network' && (
          <section className="mb-16">
            <h2
              className="text-3xl font-bold mb-8 font-mono"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff',
              }}
            >
              Network Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(0, 20, 30, 0.8)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                }}
              >
                <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>
                  Connection Status
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Primary Mesh', latency: '12ms', status: 'Connected' },
                    { name: 'Backup Cluster', latency: '45ms', status: 'Standby' },
                    { name: 'Global CDN', latency: '8ms', status: 'Connected' },
                    { name: 'Quantum Link', latency: '<1ms', status: 'Active' },
                  ].map((conn, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                      <span className="font-mono text-sm" style={{ color: '#fff' }}>{conn.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs" style={{ color: '#9ca3af' }}>{conn.latency}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-mono"
                          style={{
                            background: conn.status === 'Connected' || conn.status === 'Active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 170, 0, 0.2)',
                            color: conn.status === 'Connected' || conn.status === 'Active' ? '#00ff88' : '#ffaa00',
                          }}
                        >
                          {conn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(0, 20, 30, 0.8)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                }}
              >
                <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>
                  Traffic Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>Inbound</span>
                    <span className="font-mono text-sm" style={{ color: '#00ff88' }}>2.4 GB/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>Outbound</span>
                    <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>1.8 GB/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>Active Connections</span>
                    <span className="font-mono text-sm" style={{ color: '#fbbf24' }}>12,847</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Settings Section */}
        {activeNav === 'Settings' && (
          <section className="mb-16">
            <h2
              className="text-3xl font-bold mb-8 font-mono"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff',
              }}
            >
              System Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(0, 20, 30, 0.8)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                }}
              >
                <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>
                  Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>Neural Processing Power</span>
                      <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>{settings.neuralPower}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.neuralPower}
                      onChange={(e) => updateSetting('neuralPower', parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #00f0ff ${settings.neuralPower}%, rgba(0, 240, 255, 0.2) ${settings.neuralPower}%)` }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>Quantum Core Allocation</span>
                      <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>{settings.quantumAllocation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.quantumAllocation}
                      onChange={(e) => updateSetting('quantumAllocation', parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #ff00aa ${settings.quantumAllocation}%, rgba(255, 0, 170, 0.2) ${settings.quantumAllocation}%)` }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>Memory Cache Size</span>
                      <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>{settings.memoryCache}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.memoryCache}
                      onChange={(e) => updateSetting('memoryCache', parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #00ff88 ${settings.memoryCache}%, rgba(0, 255, 136, 0.2) ${settings.memoryCache}%)` }}
                    />
                  </div>
                </div>
              </div>
              <div
                className="p-6 rounded-xl"
                style={{
                  background: 'rgba(0, 20, 30, 0.8)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                }}
              >
                <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>
                  Security
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'biometric', label: 'Biometric Authentication' },
                    { key: 'quantumEncryption', label: 'Quantum Encryption' },
                    { key: 'intrusionDetection', label: 'Intrusion Detection' },
                    { key: 'autoUpdate', label: 'Auto-Update Security' },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-2">
                      <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>{setting.label}</span>
                      <button
                        type="button"
                        onClick={() => updateSetting(setting.key, !settings[setting.key as keyof typeof settings])}
                        className="w-12 h-6 rounded-full transition-all duration-300"
                        style={{
                          background: settings[setting.key as keyof typeof settings] ? 'rgba(0, 255, 136, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                          border: settings[setting.key as keyof typeof settings] ? '1px solid rgba(0, 255, 136, 0.5)' : '1px solid rgba(100, 100, 100, 0.5)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full transition-all duration-300"
                          style={{
                            background: settings[setting.key as keyof typeof settings] ? '#00ff88' : '#6b7280',
                            transform: settings[setting.key as keyof typeof settings] ? 'translateX(24px)' : 'translateX(0)',
                            boxShadow: settings[setting.key as keyof typeof settings] ? '0 0 10px #00ff88' : 'none',
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                className="font-mono"
                onClick={resetSettings}
                style={{
                  borderColor: 'rgba(0, 240, 255, 0.3)',
                  color: '#00f0ff',
                }}
              >
                Reset Defaults
              </Button>
              <Button
                className="font-mono"
                onClick={saveSettings}
                style={{
                  background: 'linear-gradient(135deg, #00f0ff, #00a0cc)',
                  color: '#000',
                }}
              >
                Save Changes
              </Button>
            </div>
          </section>
        )}h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>
                  Security
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Biometric Authentication', enabled: true },
                    { label: 'Quantum Encryption', enabled: true },
                    { label: 'Intrusion Detection', enabled: true },
                    { label: 'Auto-Update Security', enabled: false },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="font-mono text-sm" style={{ color: '#9ca3af' }}>{setting.label}</span>
                      <button
                        className="w-12 h-6 rounded-full transition-all duration-300"
                        style={{
                          background: setting.enabled ? 'rgba(0, 255, 136, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                          border: setting.enabled ? '1px solid rgba(0, 255, 136, 0.5)' : '1px solid rgba(100, 100, 100, 0.5)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full transition-all duration-300"
                          style={{
                            background: setting.enabled ? '#00ff88' : '#6b7280',
                            transform: setting.enabled ? 'translateX(24px)' : 'translateX(0)',
                            boxShadow: setting.enabled ? '0 0 10px #00ff88' : 'none',
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                className="font-mono"
                style={{
                  borderColor: 'rgba(0, 240, 255, 0.3)',
                  color: '#00f0ff',
                }}
              >
                Reset Defaults
              </Button>
              <Button
                className="font-mono"
                style={{
                  background: 'linear-gradient(135deg, #00f0ff, #00a0cc)',
                  color: '#000',
                }}
              >
                Save Changes
              </Button>
            </div>
          </section>
        )}

        {/* Image Generation Section */}
        {activeNav === 'ImageGen' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              🎨 AI Image Creation
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Prompt Input */}
              <div className="p-6 rounded-xl" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>Create Image</h3>
                <textarea 
                  className="w-full h-32 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                  placeholder="Describe the image you want to create..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Photorealistic', 'Anime', '3D Render', 'Digital Art', 'Oil Painting', 'Watercolor'].map((style) => (
                    <button 
                      key={style} 
                      type="button"
                      onClick={() => setImageStyle(style)}
                      className="px-3 py-1 rounded-full text-xs font-mono transition-all hover:scale-105" 
                      style={{ 
                        background: imageStyle === style ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 240, 255, 0.1)', 
                        border: imageStyle === style ? '1px solid rgba(0, 240, 255, 0.6)' : '1px solid rgba(0, 240, 255, 0.3)', 
                        color: imageStyle === style ? '#00f0ff' : '#00f0ff' 
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono mb-1 block" style={{ color: '#9ca3af' }}>Size</label>
                    <select 
                      className="w-full p-2 rounded font-mono text-sm focus:outline-none"
                      style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value)}
                    >
                      <option value="1024x1024">1024 x 1024</option>
                      <option value="768x1344">768 x 1344</option>
                      <option value="1344x768">1344 x 768</option>
                      <option value="1152x864">1152 x 864</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono mb-1 block" style={{ color: '#9ca3af' }}>Quality</label>
                    <select 
                      className="w-full p-2 rounded font-mono text-sm focus:outline-none"
                      style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                      value={imageQuality}
                      onChange={(e) => setImageQuality(e.target.value)}
                    >
                      <option>Standard</option>
                      <option>HD</option>
                      <option>Ultra HD</option>
                    </select>
                  </div>
                </div>
                
                {imageError && (
                  <div className="mt-4 p-3 rounded-lg text-sm font-mono" style={{ background: 'rgba(255, 0, 100, 0.1)', border: '1px solid rgba(255, 0, 100, 0.3)', color: '#ff6b6b' }}>
                    ⚠️ {imageError}
                  </div>
                )}
                
                <Button 
                  className="w-full mt-4 font-mono" 
                  style={{ background: 'linear-gradient(135deg, #ff00aa, #aa0066)', color: '#fff' }}
                  onClick={generateImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span> Generating...
                    </span>
                  ) : (
                    '✨ Generate Image'
                  )}
                </Button>
              </div>

              {/* Preview */}
              <div className="p-6 rounded-xl" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>Preview</h3>
                <div 
                  className="aspect-square rounded-lg flex items-center justify-center overflow-hidden" 
                  style={{ background: 'rgba(0, 10, 20, 0.8)', border: generatedImage ? '1px solid rgba(0, 240, 255, 0.3)' : '1px dashed rgba(0, 240, 255, 0.3)' }}
                >
                  {isGeneratingImage ? (
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-pulse">🎨</div>
                      <p className="font-mono text-sm" style={{ color: '#00f0ff' }}>Generating your image...</p>
                      <div className="mt-4 w-48 h-1 rounded-full mx-auto overflow-hidden" style={{ background: 'rgba(0, 240, 255, 0.2)' }}>
                        <div className="h-full animate-pulse rounded-full" style={{ width: '60%', background: 'linear-gradient(90deg, #00f0ff, #ff00aa)' }}></div>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">🖼️</div>
                      <p className="font-mono text-sm" style={{ color: '#6b7280' }}>Generated image will appear here</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 font-mono text-xs" 
                    style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}
                    onClick={generateImage}
                    disabled={!generatedImage || isGeneratingImage}
                  >
                    🔄 Regenerate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 font-mono text-xs" 
                    style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}
                    onClick={downloadImage}
                    disabled={!generatedImage}
                  >
                    ⬇️ Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 font-mono text-xs" 
                    style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}
                    onClick={copyImage}
                    disabled={!generatedImage}
                  >
                    📋 Copy
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent Creations */}
            <div className="p-6 rounded-xl" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
              <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>Recent Creations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recentImages.length > 0 ? (
                  recentImages.map((item, i) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform" 
                      style={{ border: '1px solid rgba(0, 240, 255, 0.2)' }}
                      onClick={() => setGeneratedImage(item.image)}
                    >
                      <img src={item.image} alt={item.prompt} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-4xl mb-2">🎨</div>
                    <p className="font-mono text-sm" style={{ color: '#6b7280' }}>Your generated images will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* IDE Section */}
        {activeNav === 'IDE' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              💻 Quantum IDE
            </h2>
            
            <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0, 10, 20, 0.95)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
              {/* IDE Header */}
              <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(0, 20, 40, 0.8)', borderBottom: '1px solid rgba(0, 240, 255, 0.2)' }}>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#27ca40' }} />
                  </div>
                  <span className="font-mono text-xs" style={{ color: '#9ca3af' }}>nexus-project / src / app.tsx</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>▶ Run</button>
                  <button className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }}>⚡ Deploy</button>
                </div>
              </div>
              
              <div className="flex">
                {/* Sidebar */}
                <div className="w-48 p-2 border-r" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                  {['📁 src', '  📄 app.tsx', '  📄 utils.ts', '  📁 components', '    📄 Header.tsx', '    📄 Button.tsx', '📁 public', '  🖼️ logo.png', '📄 package.json', '📄 tsconfig.json'].map((file, i) => (
                    <div key={i} className="font-mono text-xs py-1 px-2 rounded cursor-pointer hover:bg-cyan-500/10" style={{ color: file.includes('app.tsx') ? '#00f0ff' : '#9ca3af' }}>
                      {file}
                    </div>
                  ))}
                </div>
                
                {/* Code Editor */}
                <div className="flex-1 p-4 font-mono text-sm" style={{ color: '#e5e7eb' }}>
                  <div className="flex">
                    <div className="text-right pr-4 select-none" style={{ color: '#4b5563' }}>
                      {Array.from({ length: 12 }, (_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <div className="flex-1">
                      <div><span style={{ color: '#c084fc' }}>import</span> {'{'} QuantumCore {'}'} <span style={{ color: '#c084fc' }}>from</span> <span style={{ color: '#4ade80' }}>'@nexus/core'</span>;</div>
                      <div></div>
                      <div><span style={{ color: '#c084fc' }}>export</span> <span style={{ color: '#c084fc' }}>default</span> <span style={{ color: '#60a5fa' }}>function</span> <span style={{ color: '#fbbf24' }}>App</span>() {'{'}</div>
                      <div>  <span style={{ color: '#60a5fa' }}>const</span> [state, setState] = QuantumCore.<span style={{ color: '#fbbf24' }}>useState</span>(<span style={{ color: '#4ade80' }}>'initial'</span>);</div>
                      <div></div>
                      <div>  <span style={{ color: '#60a5fa' }}>return</span> (</div>
                      <div>    <span style={{ color: '#f472b6' }}>&lt;QuantumContainer&gt;</span></div>
                      <div>      <span style={{ color: '#f472b6' }}>&lt;NeuralHeader</span> title=<span style={{ color: '#4ade80' }}>"NEXUS OS"</span> <span style={{ color: '#f472b6' }}>/&gt;</span></div>
                      <div>      <span style={{ color: '#f472b6' }}>&lt;AIProcessor</span> cores=<span style={{ color: '#fbbf24' }}>{'{'}8{'}'}</span> <span style={{ color: '#f472b6' }}>/&gt;</span></div>
                      <div>    <span style={{ color: '#f472b6' }}>&lt;/QuantumContainer&gt;</span></div>
                      <div>  );</div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Terminal */}
              <div className="border-t p-3 font-mono text-xs" style={{ borderColor: 'rgba(0, 240, 255, 0.2)', background: 'rgba(0, 5, 10, 0.8)' }}>
                <div style={{ color: '#00ff88' }}>✓ Compiled successfully in 247ms</div>
                <div style={{ color: '#00f0ff' }}>→ Ready on http://localhost:3000</div>
                <div style={{ color: '#6b7280' }}>→ AI Assistant: Detected 2 optimization opportunities</div>
              </div>
            </div>
          </section>
        )}

        {/* CLI Section */}
        {activeNav === 'CLI' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              ⌨️ Command Center
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Terminal */}
              <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: 'rgba(0, 5, 10, 0.95)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(0, 20, 40, 0.8)' }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#27ca40' }} />
                  <span className="ml-4 text-xs font-mono" style={{ color: '#6b7280' }}>NEXUS Terminal v9.0</span>
                </div>
                <div className="p-4 font-mono text-sm h-80 overflow-y-auto" ref={terminalRef}>
                  <div style={{ color: '#00f0ff' }}>NEXUS OS Command Center</div>
                  <div style={{ color: '#6b7280' }}>Type "help" for available commands</div>
                  <div className="mt-4">
                    <span style={{ color: '#00ff88' }}>nexus@system:~$</span>
                    <span className="ml-2" style={{ color: '#fff' }}>system --status</span>
                  </div>
                  <div className="mt-1 ml-4" style={{ color: '#9ca3af' }}>
                    <div>CPU: ████████████████░░░░ 78%</div>
                    <div>MEM: ██████████████░░░░░░ 62%</div>
                    <div>AI:  ████████████████████ 100%</div>
                    <div>QNT: ██████████████████░░ 91%</div>
                  </div>
                  <div className="mt-4">
                    <span style={{ color: '#00ff88' }}>nexus@system:~$</span>
                    <span className="ml-2 animate-pulse" style={{ color: '#00f0ff' }}>▋</span>
                  </div>
                </div>
              </div>

              {/* Quick Commands */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                <h3 className="text-lg font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>Quick Commands</h3>
                <div className="space-y-2">
                  {[
                    { cmd: 'system --status', desc: 'Show system status' },
                    { cmd: 'ai --evolve', desc: 'Trigger AI evolution' },
                    { cmd: 'network --scan', desc: 'Scan network nodes' },
                    { cmd: 'quantum --sync', desc: 'Sync quantum cores' },
                    { cmd: 'security --audit', desc: 'Run security audit' },
                    { cmd: 'clear', desc: 'Clear terminal' },
                  ].map((item, i) => (
                    <button key={i} className="w-full text-left p-2 rounded-lg transition-all hover:bg-cyan-500/10" style={{ border: '1px solid rgba(0, 240, 255, 0.1)' }}>
                      <div className="font-mono text-xs" style={{ color: '#00f0ff' }}>{item.cmd}</div>
                      <div className="font-mono text-xs" style={{ color: '#6b7280' }}>{item.desc}</div>
                    </button>
                  ))}
                </div>
                
                <h3 className="text-lg font-bold mb-4 mt-6 font-mono" style={{ color: '#00f0ff' }}>Recent History</h3>
                <div className="space-y-1 font-mono text-xs" style={{ color: '#6b7280' }}>
                  <div>→ deploy --production</div>
                  <div>→ ai --train --model=gpt5</div>
                  <div>→ network --mesh --connect</div>
                  <div>→ quantum --entangle</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Chat Section */}
        {activeNav === 'Chat' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              💬 Neural Chat
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'ai', label: 'AI Assistant', icon: '🤖' },
                { id: 'video', label: 'Video Room', icon: '📹' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveChatTab(tab.id as 'ai' | 'video')}
                  className="px-4 py-2 rounded-lg font-mono text-sm transition-all"
                  style={{
                    background: activeChatTab === tab.id ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 20, 30, 0.8)',
                    border: activeChatTab === tab.id ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(0, 240, 255, 0.2)',
                    color: activeChatTab === tab.id ? '#00f0ff' : '#9ca3af',
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
            
            {/* AI Chat Tab */}
            {activeChatTab === 'ai' && (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Contacts */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono font-bold" style={{ color: '#00f0ff' }}>Contacts</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono" style={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88' }}>12 online</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'AI Core', status: 'online', avatar: '🤖' },
                    { name: 'Quantum Team', status: 'online', avatar: '⚛️' },
                    { name: 'Security Ops', status: 'online', avatar: '🔐' },
                    { name: 'Dev Squad', status: 'away', avatar: '👨‍💻' },
                    { name: 'Research Lab', status: 'online', avatar: '🔬' },
                  ].map((contact, i) => (
                    <button 
                      key={i} 
                      type="button"
                      onClick={() => setSelectedContact(i)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-cyan-500/10 transition-all text-left" 
                      style={{ background: selectedContact === i ? 'rgba(0, 240, 255, 0.1)' : 'transparent' }}
                    >
                      <span className="text-2xl">{contact.avatar}</span>
                      <div className="flex-1">
                        <div className="font-mono text-sm" style={{ color: '#fff' }}>{contact.name}</div>
                        <div className="font-mono text-xs" style={{ color: '#6b7280' }}>{contact.status}</div>
                      </div>
                      <span className="w-2 h-2 rounded-full" style={{ background: contact.status === 'online' ? '#00ff88' : '#fbbf24' }} />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chat Window */}
              <div className="lg:col-span-3 rounded-xl overflow-hidden flex flex-col" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)', height: '500px' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.1)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <div className="font-mono font-bold" style={{ color: '#fff' }}>AI Core</div>
                      <div className="font-mono text-xs" style={{ color: '#00ff88' }}>Online • Quantum Neural Network</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="p-2 rounded-lg hover:bg-cyan-500/10 transition-colors" style={{ color: '#9ca3af' }}>📞</button>
                    <button type="button" className="p-2 rounded-lg hover:bg-cyan-500/10 transition-colors" style={{ color: '#9ca3af' }}>📹</button>
                    <button type="button" className="p-2 rounded-lg hover:bg-cyan-500/10 transition-colors" style={{ color: '#9ca3af' }}>📌</button>
                  </div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && <span className="text-xl flex-shrink-0">🤖</span>}
                      <div className={`p-3 rounded-lg max-w-md ${msg.role === 'user' ? '' : ''}`} style={{ background: msg.role === 'user' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 240, 255, 0.1)' }}>
                        <p className="font-mono text-sm whitespace-pre-wrap" style={{ color: '#e5e7eb' }}>{msg.content}</p>
                        <p className="font-mono text-xs mt-1" style={{ color: '#6b7280' }}>{msg.time}</p>
                      </div>
                      {msg.role === 'user' && <span className="text-xl flex-shrink-0">👤</span>}
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex gap-3">
                      <span className="text-xl">🤖</span>
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#00f0ff', animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#00f0ff', animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#00f0ff', animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 p-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }} 
                      placeholder="Type a message..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                      disabled={isChatLoading}
                    />
                    <Button 
                      className="font-mono px-6"
                      style={{ background: 'linear-gradient(135deg, #00f0ff, #00a0cc)', color: '#000' }}
                      onClick={sendChatMessage}
                      disabled={isChatLoading || !chatInput.trim()}
                    >
                      {isChatLoading ? '...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {/* Video Room Tab */}
            {activeChatTab === 'video' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Video Area */}
                <div className="lg:col-span-2 space-y-4">
                  {isInRoom ? (
                    <>
                      {/* Video Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Local Video */}
                        <div className="rounded-xl overflow-hidden relative" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', aspectRatio: '4/3' }}>
                          <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          {!isVideoEnabled && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
                              <span className="text-4xl">👤</span>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 0, 0, 0.7)', color: '#00f0ff' }}>
                            {userName} (You)
                          </div>
                        </div>
                        
                        {/* Remote Video */}
                        <div className="rounded-xl overflow-hidden relative" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(255, 0, 170, 0.3)', aspectRatio: '4/3' }}>
                          <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
                            <div className="text-center">
                              <span className="text-4xl">🎥</span>
                              <p className="font-mono text-xs mt-2" style={{ color: '#6b7280' }}>Waiting for others...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={toggleVideo}
                          className={`p-4 rounded-full transition-all ${isVideoEnabled ? '' : 'opacity-50'}`}
                          style={{ background: isVideoEnabled ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 0, 100, 0.2)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
                          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                        >
                          {isVideoEnabled ? '📹' : '🚫'}
                        </button>
                        <button
                          type="button"
                          onClick={toggleAudio}
                          className={`p-4 rounded-full transition-all ${isAudioEnabled ? '' : 'opacity-50'}`}
                          style={{ background: isAudioEnabled ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 0, 100, 0.2)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
                          title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                        >
                          {isAudioEnabled ? '🎤' : '🔇'}
                        </button>
                        <button
                          type="button"
                          onClick={leaveVideoRoom}
                          className="p-4 rounded-full transition-all hover:scale-110"
                          style={{ background: 'rgba(255, 0, 100, 0.3)', border: '1px solid rgba(255, 0, 100, 0.5)' }}
                          title="Leave room"
                        >
                          📵
                        </button>
                      </div>
                      
                      {/* Room Info */}
                      <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                        <span className="font-mono text-sm" style={{ color: '#00ff88' }}>Room Code: </span>
                        <span className="font-mono text-lg font-bold" style={{ color: '#00f0ff' }}>{roomCode}</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(roomCode)}
                          className="ml-2 px-2 py-1 rounded text-xs font-mono"
                          style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}
                        >
                          Copy
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Join Room UI */
                    <div className="rounded-xl p-8 text-center" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                      <div className="text-6xl mb-6">📹</div>
                      <h3 className="text-xl font-bold mb-4 font-mono" style={{ color: '#00f0ff' }}>Video Chat Room</h3>
                      <p className="font-mono text-sm mb-6" style={{ color: '#9ca3af' }}>
                        Create a room and share the code with others to start a video chat
                      </p>
                      
                      {videoError && (
                        <div className="mb-4 p-3 rounded-lg font-mono text-sm" style={{ background: 'rgba(255, 0, 100, 0.1)', border: '1px solid rgba(255, 0, 100, 0.3)', color: '#ff6b6b' }}>
                          ⚠️ {videoError}
                        </div>
                      )}
                      
                      <div className="space-y-4 max-w-sm mx-auto">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="Enter room code"
                            className="flex-1 p-3 rounded-lg font-mono text-sm text-center uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                            maxLength={8}
                          />
                          <Button
                            onClick={() => joinVideoRoom()}
                            style={{ background: 'linear-gradient(135deg, #00f0ff, #00a0cc)', color: '#000' }}
                          >
                            Join
                          </Button>
                        </div>
                        
                        <div className="font-mono text-xs" style={{ color: '#6b7280' }}>— or —</div>
                        
                        <Button
                          onClick={() => { generateRoomCode(); joinVideoRoom(generateRoomCode()); }}
                          className="w-full font-mono"
                          style={{ background: 'linear-gradient(135deg, #ff00aa, #aa0066)', color: '#fff' }}
                        >
                          ✨ Create New Room
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Chat Sidebar */}
                <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)', height: '500px' }}>
                  <div className="p-4 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                    <h3 className="font-mono font-bold" style={{ color: '#00f0ff' }}>💬 Room Chat</h3>
                    <p className="font-mono text-xs" style={{ color: '#6b7280' }}>You are: {userName}</p>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {roomMessages.length > 0 ? roomMessages.map((msg, i) => (
                      <div key={i} className="p-2 rounded-lg" style={{ background: msg.user === 'System' ? 'rgba(255, 187, 46, 0.1)' : msg.user === userName ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 240, 255, 0.1)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold" style={{ color: msg.user === 'System' ? '#fbbf24' : msg.user === userName ? '#00ff88' : '#00f0ff' }}>{msg.user}</span>
                          <span className="font-mono text-xs" style={{ color: '#6b7280' }}>{msg.time}</span>
                        </div>
                        <p className="font-mono text-sm" style={{ color: '#e5e7eb' }}>{msg.content}</p>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <p className="font-mono text-sm" style={{ color: '#6b7280' }}>Join a room to start chatting</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendRoomMessage()}
                        placeholder="Type a message..."
                        disabled={!isInRoom}
                        className="flex-1 p-2 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                      />
                      <Button
                        onClick={sendRoomMessage}
                        disabled={!isInRoom || !roomInput.trim()}
                        className="font-mono"
                        style={{ background: 'linear-gradient(135deg, #00f0ff, #00a0cc)', color: '#000' }}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Media Desk Section */}
        {activeNav === 'MediaDesk' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              🎬 Media Desk Pro
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'player', label: 'Media Player', icon: '🎬' },
                { id: 'radio', label: 'Radio', icon: '📻' },
                { id: 'editor', label: 'Editor', icon: '✂️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMediaTab(tab.id as 'player' | 'radio' | 'editor')}
                  className="px-4 py-2 rounded-lg font-mono text-sm transition-all"
                  style={{
                    background: activeMediaTab === tab.id ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 20, 30, 0.8)',
                    border: activeMediaTab === tab.id ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(0, 240, 255, 0.2)',
                    color: activeMediaTab === tab.id ? '#00f0ff' : '#9ca3af',
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
            
            {/* Radio Tab */}
            {activeMediaTab === 'radio' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Radio Player */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Now Playing */}
                  <div className="rounded-xl p-6" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Now Playing</h3>
                    
                    {currentStation ? (
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-20 h-20 rounded-lg flex items-center justify-center text-4xl"
                          style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(255, 0, 170, 0.2))' }}
                        >
                          {currentStation.favicon ? (
                            <img src={currentStation.favicon} alt="" className="w-16 h-16 rounded object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '📻' }} />
                          ) : '📻'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-mono text-lg font-bold" style={{ color: '#fff' }}>{currentStation.name}</h4>
                          <p className="font-mono text-sm" style={{ color: '#9ca3af' }}>{currentStation.country}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {isRadioPlaying && (
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <div 
                                    key={i}
                                    className="w-1 bg-cyan-400 rounded animate-pulse"
                                    style={{ 
                                      height: `${8 + Math.random() * 12}px`,
                                      animationDelay: `${i * 0.1}s`
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                            <span className="font-mono text-xs" style={{ color: isRadioPlaying ? '#00ff88' : '#6b7280' }}>
                              {isRadioPlaying ? '● LIVE' : isRadioLoading ? 'Loading...' : 'Stopped'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={toggleRadioPlay}
                            disabled={isRadioLoading}
                            className="p-4 rounded-full transition-all hover:scale-110"
                            style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}
                          >
                            {isRadioLoading ? '⏳' : isRadioPlaying ? '⏸️' : '▶️'}
                          </button>
                          <button
                            type="button"
                            onClick={stopRadio}
                            className="p-3 rounded-full transition-all hover:bg-red-500/20"
                            style={{ color: '#ff6b6b' }}
                          >
                            ⏹️
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-5xl mb-4">📻</div>
                        <p className="font-mono" style={{ color: '#6b7280' }}>Select a station to start listening</p>
                      </div>
                    )}
                    
                    {/* Volume Control */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                      <span style={{ color: '#9ca3af' }}>🔈</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={radioVolume}
                        onChange={handleRadioVolumeChange}
                        className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #00f0ff ${radioVolume}%, rgba(0, 240, 255, 0.2) ${radioVolume}%)` }}
                      />
                      <span style={{ color: '#9ca3af' }}>🔊</span>
                      <span className="font-mono text-xs w-10 text-right" style={{ color: '#6b7280' }}>{radioVolume}%</span>
                    </div>
                    
                    {radioError && (
                      <div className="mt-4 p-3 rounded-lg font-mono text-sm" style={{ background: 'rgba(255, 100, 100, 0.1)', border: '1px solid rgba(255, 100, 100, 0.3)', color: '#ff6b6b' }}>
                        ⚠️ {radioError}
                      </div>
                    )}
                  </div>
                  
                  {/* Search */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={radioSearch}
                        onChange={(e) => setRadioSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchRadioStations()}
                        placeholder="Search stations by name (e.g., BBC, Jazz, Rock)..."
                        className="flex-1 p-3 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                      />
                      <Button
                        onClick={() => searchRadioStations()}
                        disabled={isRadioLoading}
                        style={{ background: 'linear-gradient(135deg, #00f0ff, #00a0cc)', color: '#000' }}
                      >
                        🔍 Search
                      </Button>
                    </div>
                    
                    {/* Quick Search Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Jazz', 'Rock', 'Pop', 'Classical', 'News', 'Electronic', 'Hip Hop', 'Country'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => { setRadioSearch(tag); searchRadioStations(tag) }}
                          className="px-2 py-1 rounded-full text-xs font-mono transition-all hover:scale-105"
                          style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Station List */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>
                      Stations {radioStations.length > 0 && `(${radioStations.length})`}
                    </h3>
                    
                    {isRadioLoading ? (
                      <div className="text-center py-8">
                        <div className="text-4xl animate-pulse">📻</div>
                        <p className="font-mono text-sm mt-2" style={{ color: '#6b7280' }}>Searching...</p>
                      </div>
                    ) : radioStations.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                        {radioStations.map((station) => (
                          <button
                            key={station.id}
                            type="button"
                            onClick={() => playRadioStation(station)}
                            className={`p-3 rounded-lg text-left transition-all hover:scale-102 ${currentStation?.id === station.id ? 'ring-2 ring-cyan-400' : ''}`}
                            style={{ background: currentStation?.id === station.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">📻</span>
                              <span className="font-mono text-xs font-bold truncate" style={{ color: '#fff' }}>{station.name}</span>
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="font-mono text-xs" style={{ color: '#6b7280' }}>{station.country}</span>
                              {station.bitrate > 0 && (
                                <span className="font-mono text-xs px-1 rounded" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
                                  {station.bitrate}kbps
                                </span>
                              )}
                            </div>
                            {station.tags.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {station.tags.slice(0, 2).map((tag, i) => (
                                  <span key={i} className="font-mono text-xs px-1 rounded" style={{ background: 'rgba(255, 0, 170, 0.1)', color: '#ff00aa' }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="font-mono text-sm" style={{ color: '#6b7280' }}>Search for stations to see results</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Popular Genres</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Top 40', icon: '🎵' },
                        { name: 'Jazz', icon: '🎷' },
                        { name: 'Classical', icon: '🎻' },
                        { name: 'Electronic', icon: '🎹' },
                        { name: 'Rock', icon: '🎸' },
                        { name: 'News', icon: '📰' },
                      ].map((genre) => (
                        <button
                          key={genre.name}
                          type="button"
                          onClick={() => { setRadioSearch(genre.name); searchRadioStations(genre.name) }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-cyan-500/10"
                          style={{ border: '1px solid rgba(0, 240, 255, 0.1)' }}
                        >
                          <span>{genre.icon}</span>
                          <span className="font-mono text-sm" style={{ color: '#e5e7eb' }}>{genre.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Info</h3>
                    <div className="font-mono text-xs space-y-2" style={{ color: '#9ca3af' }}>
                      <p>• 30,000+ stations worldwide</p>
                      <p>• Search by name or genre</p>
                      <p>• High quality streaming</p>
                      <p>• Free to use</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Media Player Tab */}
            {activeMediaTab === 'player' && (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Video/Audio Controls */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Main Preview */}
                  <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <div className="aspect-video flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(255, 0, 170, 0.1))' }}>
                      {mediaFile ? (
                        <video 
                          src={mediaFile} 
                          className="w-full h-full object-contain"
                          onClick={togglePlay}
                        />
                      ) : (
                        <div className="text-center">
                          <label className="cursor-pointer">
                            <input 
                              type="file" 
                              accept="video/*,audio/*" 
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                            <div className="text-6xl mb-4">🎬</div>
                            <p className="font-mono" style={{ color: '#9ca3af' }}>Click to upload media file</p>
                            <p className="font-mono text-xs mt-2" style={{ color: '#6b7280' }}>Supports: MP4, WebM, MP3, WAV, OGG</p>
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {/* Progress bar */}
                      <div className="mb-4">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, #00f0ff ${(currentTime/duration)*100}%, rgba(0, 240, 255, 0.2) ${(currentTime/duration)*100}%)` }}
                        />
                      </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <button 
                        type="button"
                        onClick={togglePlay}
                        className="p-3 rounded-full transition-all hover:scale-110" 
                        style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}
                      >
                        {isPlaying ? '⏸️' : '▶️'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCurrentTime(0)}
                        className="p-2 rounded-full transition-all hover:bg-cyan-500/10" 
                        style={{ color: '#9ca3af' }}
                      >
                        ⏮️
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                        className="p-2 rounded-full transition-all hover:bg-cyan-500/10" 
                        style={{ color: '#9ca3af' }}
                      >
                        ⏪
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                        className="p-2 rounded-full transition-all hover:bg-cyan-500/10" 
                        style={{ color: '#9ca3af' }}
                      >
                        ⏩
                      </button>
                      <span className="font-mono text-xs flex-1 text-center" style={{ color: '#6b7280' }}>
                        {mediaFileName || 'No file loaded'}
                      </span>
                      <span className="font-mono text-xs" style={{ color: '#00f0ff' }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    {/* Volume control */}
                    <div className="flex items-center gap-2 mb-4">
                      <button 
                        type="button"
                        onClick={toggleMute}
                        className="p-2 rounded-lg hover:bg-cyan-500/10 transition-all"
                        style={{ color: '#9ca3af' }}
                      >
                        {isMuted || volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #00f0ff ${isMuted ? 0 : volume}%, rgba(0, 240, 255, 0.2) ${isMuted ? 0 : volume}%)` }}
                      />
                      <span className="font-mono text-xs" style={{ color: '#6b7280' }}>{isMuted ? 0 : volume}%</span>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      {[
                        { icon: '✂️', label: 'Cut' },
                        { icon: '📝', label: 'Edit' },
                        { icon: '🎨', label: 'Effects' },
                        { icon: '🔄', label: 'Reset' },
                        { icon: '⬇️', label: 'Export' }
                      ].map((tool, i) => (
                        <button 
                          key={i} 
                          type="button"
                          className="p-2 rounded-lg hover:bg-cyan-500/10 transition-all group relative"
                          style={{ color: '#9ca3af' }}
                          title={tool.label}
                        >
                          <span className="text-xl">{tool.icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono font-bold" style={{ color: '#00f0ff' }}>Timeline</h3>
                    <div className="flex gap-2">
                      <button type="button" className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>+ Add Track</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Video Track', 'Audio Track', 'Effects'].map((track, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="font-mono text-xs w-24" style={{ color: '#6b7280' }}>{track}</span>
                        <div className="flex-1 h-8 rounded relative" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                          <div 
                            className="h-full rounded flex items-center px-2 transition-all cursor-pointer hover:opacity-80"
                            style={{ 
                              width: `${60 + i * 20}%`, 
                              background: i === 0 ? 'rgba(0, 240, 255, 0.3)' : i === 1 ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 0, 170, 0.3)',
                              marginLeft: `${i * 5}%`
                            }}
                          >
                            <span className="font-mono text-xs" style={{ color: '#fff' }}>{track.split(' ')[0]}</span>
                          </div>
                          {/* Playhead */}
                          {i === 0 && (
                            <div 
                              className="absolute top-0 bottom-0 w-0.5"
                              style={{ left: `${(currentTime/duration)*100}%`, background: '#ff00aa' }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Tools Panel */}
              <div className="space-y-4">
                {/* Upload */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Media</h3>
                  <label className="block cursor-pointer">
                    <input 
                      type="file" 
                      accept="video/*,audio/*" 
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div 
                      className="border-2 border-dashed rounded-lg p-6 text-center transition-all hover:border-cyan-400"
                      style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}
                    >
                      <div className="text-3xl mb-2">📁</div>
                      <p className="font-mono text-xs" style={{ color: '#9ca3af' }}>Upload Media</p>
                    </div>
                  </label>
                </div>
                
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>AI Tools</h3>
                  <div className="space-y-2">
                    {[
                      { icon: '✨', name: 'Auto Enhance', desc: 'Improve quality' },
                      { icon: '🎯', name: 'Smart Crop', desc: 'AI-powered framing' },
                      { icon: '🔊', name: 'Noise Removal', desc: 'Clean audio' },
                      { icon: '📝', name: 'Auto Captions', desc: 'Generate subtitles' },
                      { icon: '🎭', name: 'Background Replace', desc: 'Change backdrop' },
                    ].map((tool, i) => (
                      <button 
                        key={i} 
                        type="button"
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-cyan-500/10 active:scale-95"
                        style={{ border: '1px solid rgba(0, 240, 255, 0.1)' }}
                      >
                        <span className="text-xl">{tool.icon}</span>
                        <div className="text-left">
                          <div className="font-mono text-sm" style={{ color: '#fff' }}>{tool.name}</div>
                          <div className="font-mono text-xs" style={{ color: '#6b7280' }}>{tool.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Export</h3>
                  <select className="w-full p-2 rounded mb-3 font-mono text-sm focus:outline-none" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}>
                    <option>MP4 (1080p)</option>
                    <option>MP4 (4K)</option>
                    <option>WebM</option>
                    <option>GIF</option>
                    <option>MP3 (Audio)</option>
                  </select>
                  <Button 
                    className="w-full font-mono"
                    style={{ background: 'linear-gradient(135deg, #ff00aa, #aa0066)', color: '#fff' }}
                    disabled={!mediaFile}
                  >
                    Export Project
                  </Button>
                </div>
              </div>
            </div>
            )}
            
            {/* Editor Tab */}
            {activeMediaTab === 'editor' && (
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Main Editor Area */}
                <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  {/* Editor Header */}
                  <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(0, 20, 40, 0.8)', borderBottom: '1px solid rgba(0, 240, 255, 0.1)' }}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>✂️ Media Editor</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="px-3 py-1 rounded font-mono text-xs" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>↩️ Undo</button>
                      <button type="button" className="px-3 py-1 rounded font-mono text-xs" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>↪️ Redo</button>
                      <button type="button" className="px-3 py-1 rounded font-mono text-xs" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }}>💾 Save</button>
                    </div>
                  </div>
                  
                  {/* Timeline Area */}
                  <div className="p-4">
                    <div className="mb-4 flex items-center gap-4">
                      <span className="font-mono text-xs" style={{ color: '#6b7280' }}>00:00:00</span>
                      <div className="flex-1 h-8 rounded relative" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                        {/* Time markers */}
                        {[0, 25, 50, 75, 100].map((pos) => (
                          <div key={pos} className="absolute top-0 bottom-0 w-px" style={{ left: `${pos}%`, background: 'rgba(0, 240, 255, 0.2)' }} />
                        ))}
                        {/* Playhead */}
                        <div className="absolute top-0 bottom-0 w-0.5 z-10" style={{ left: '35%', background: '#ff00aa' }}>
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full" style={{ background: '#ff00aa' }} />
                        </div>
                      </div>
                      <span className="font-mono text-xs" style={{ color: '#6b7280' }}>00:03:45</span>
                    </div>
                    
                    {/* Tracks */}
                    <div className="space-y-2">
                      {[
                        { name: 'Video Track', color: '#00f0ff', width: 80, start: 0 },
                        { name: 'Audio Track', color: '#00ff88', width: 60, start: 10 },
                        { name: 'Effects', color: '#ff00aa', width: 40, start: 20 },
                        { name: 'Subtitles', color: '#fbbf24', width: 90, start: 5 },
                      ].map((track, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-28 flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-mono text-xs truncate" style={{ color: '#9ca3af' }}>{track.name}</span>
                          </div>
                          <div className="flex-1 h-10 rounded relative" style={{ background: 'rgba(0, 10, 20, 0.8)' }}>
                            <div 
                              className="h-8 my-1 rounded flex items-center px-2 cursor-pointer hover:brightness-110 transition-all"
                              style={{ 
                                width: `${track.width}%`, 
                                background: `${track.color}30`,
                                borderLeft: `3px solid ${track.color}`,
                                marginLeft: `${track.start}%`
                              }}
                            >
                              <span className="font-mono text-xs truncate" style={{ color: track.color }}>{track.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Preview Area */}
                  <div className="grid grid-cols-2 gap-4 p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                    <div className="aspect-video rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(255, 0, 170, 0.1))' }}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎬</div>
                        <p className="font-mono text-xs" style={{ color: '#6b7280' }}>Source Preview</p>
                      </div>
                    </div>
                    <div className="aspect-video rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 240, 255, 0.1))' }}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">✨</div>
                        <p className="font-mono text-xs" style={{ color: '#6b7280' }}>Output Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Editor Tools Sidebar */}
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Tools</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: '✂️', name: 'Cut' },
                        { icon: '📋', name: 'Copy' },
                        { icon: '📌', name: 'Paste' },
                        { icon: '🗑️', name: 'Delete' },
                        { icon: '🔗', name: 'Split' },
                        { icon: '🔀', name: 'Merge' },
                      ].map((tool, i) => (
                        <button key={i} type="button" className="p-2 rounded-lg transition-all hover:scale-105 flex flex-col items-center gap-1" style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                          <span className="text-lg">{tool.icon}</span>
                          <span className="font-mono text-xs" style={{ color: '#9ca3af' }}>{tool.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Effects</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Blur', icon: '🌫️' },
                        { name: 'Brightness', icon: '☀️' },
                        { name: 'Contrast', icon: '◐' },
                        { name: 'Saturation', icon: '🎨' },
                        { name: 'Fade', icon: '🔜' },
                        { name: 'Zoom', icon: '🔍' },
                      ].map((effect, i) => (
                        <button key={i} type="button" className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-500/10 transition-all" style={{ border: '1px solid rgba(0, 240, 255, 0.1)' }}>
                          <span>{effect.icon}</span>
                          <span className="font-mono text-xs" style={{ color: '#e5e7eb' }}>{effect.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Transitions</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['⬛➡️⬜', '🔄', '💫', '✨', '🌀', '💥'].map((trans, i) => (
                        <button key={i} type="button" className="p-2 rounded text-xs hover:bg-cyan-500/10 transition-all" style={{ border: '1px solid rgba(0, 240, 255, 0.1)', color: '#9ca3af' }}>
                          {trans}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Game Creation Section */}
        {activeNav === 'GameCreation' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              🎮 Game Studio
            </h2>
            
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Scene Editor */}
              <div className="lg:col-span-3 space-y-4">
                {/* Toolbar */}
                <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(0, 20, 40, 0.8)', borderBottom: '1px solid rgba(0, 240, 255, 0.1)' }}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>Scene: Level_01</span>
                      <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }}>
                        Score: {gameScore}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={isGamePlaying ? pauseGame : startGame}
                        className="px-4 py-1.5 rounded font-mono text-xs transition-all hover:scale-105"
                        style={{ background: isGamePlaying ? 'rgba(255, 170, 0, 0.2)' : 'rgba(0, 255, 136, 0.2)', color: isGamePlaying ? '#fbbf24' : '#00ff88', border: '1px solid currentColor' }}
                      >
                        {isGamePlaying ? '⏸️ Pause' : '▶️ Play'}
                      </button>
                      <button 
                        type="button"
                        onClick={stopGame}
                        className="px-4 py-1.5 rounded font-mono text-xs transition-all hover:scale-105"
                        style={{ background: 'rgba(255, 0, 100, 0.2)', color: '#ff6b6b', border: '1px solid currentColor' }}
                      >
                        ⏹️ Stop
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowCodeEditor(!showCodeEditor)}
                        className={`px-4 py-1.5 rounded font-mono text-xs transition-all hover:scale-105 ${showCodeEditor ? '' : ''}`}
                        style={{ background: showCodeEditor ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 240, 255, 0.1)', color: '#00f0ff', border: '1px solid currentColor' }}
                      >
                        📝 Code
                      </button>
                    </div>
                  </div>
                  
                  {/* Game Canvas */}
                  <div className="relative">
                    <canvas
                      ref={gameCanvasRef}
                      width={600}
                      height={280}
                      className="w-full"
                      style={{ background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)' }}
                    />
                    {!isGamePlaying && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎮</div>
                          <p className="font-mono text-sm" style={{ color: '#6b7280' }}>Press Play to start the game</p>
                          <p className="font-mono text-xs mt-1" style={{ color: '#4b5563' }}>Use Arrow Keys or WASD to move, Space to jump</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Code Editor */}
                {showCodeEditor && (
                  <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(0, 10, 20, 0.9)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(0, 20, 40, 0.8)', borderBottom: '1px solid rgba(0, 240, 255, 0.1)' }}>
                      <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>📝 PlayerController.js</span>
                      <div className="flex gap-2">
                        <button type="button" className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>Save</button>
                        <button type="button" className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }}>Run</button>
                      </div>
                    </div>
                    <textarea
                      value={gameCode}
                      onChange={(e) => setGameCode(e.target.value)}
                      className="w-full h-40 p-4 font-mono text-sm resize-none focus:outline-none"
                      style={{ background: 'transparent', color: '#e5e7eb', border: 'none' }}
                      spellCheck={false}
                    />
                  </div>
                )}
                
                {/* Object Properties */}
                {selectedObject && (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-mono font-bold" style={{ color: '#00f0ff' }}>📦 Object Properties</h3>
                      <button
                        type="button"
                        onClick={() => deleteGameObject(selectedObject)}
                        className="px-2 py-1 rounded text-xs font-mono"
                        style={{ background: 'rgba(255, 0, 100, 0.1)', color: '#ff6b6b' }}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-xs" style={{ color: '#6b7280' }}>Name</label>
                        <input
                          type="text"
                          value={gameObjects.find(o => o.id === selectedObject)?.name || ''}
                          className="w-full mt-1 p-2 rounded font-mono text-sm"
                          style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs" style={{ color: '#6b7280' }}>Type</label>
                        <input
                          type="text"
                          value={gameObjects.find(o => o.id === selectedObject)?.type || ''}
                          className="w-full mt-1 p-2 rounded font-mono text-sm"
                          style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-4">
                {/* Hierarchy */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-3" style={{ color: '#00f0ff' }}>📁 Hierarchy</h3>
                  <div className="space-y-1">
                    {gameObjects.map((obj) => (
                      <button
                        key={obj.id}
                        type="button"
                        onClick={() => selectGameObject(obj.id)}
                        className={`w-full text-left px-2 py-1.5 rounded font-mono text-xs transition-all ${obj.selected ? 'ring-1 ring-cyan-400' : ''}`}
                        style={{ 
                          background: obj.selected ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                          color: obj.type === 'player' ? '#00f0ff' : obj.type === 'enemy' ? '#ff00aa' : obj.type === 'coin' ? '#fbbf24' : '#9ca3af'
                        }}
                      >
                        {obj.type === 'player' ? '🎮' : obj.type === 'enemy' ? '👾' : obj.type === 'coin' ? '💰' : '📦'} {obj.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Add Objects */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-3" style={{ color: '#00f0ff' }}>➕ Add Object</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'player', icon: '🎮', label: 'Player' },
                      { type: 'enemy', icon: '👾', label: 'Enemy' },
                      { type: 'coin', icon: '💰', label: 'Coin' },
                      { type: 'platform', icon: '📦', label: 'Platform' },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => addGameObject(item.type)}
                        className="p-2 rounded-lg transition-all hover:scale-105 text-center"
                        style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.2)' }}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div className="font-mono text-xs" style={{ color: '#9ca3af' }}>{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* AI Assistants */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-3" style={{ color: '#00f0ff' }}>🤖 AI Assistants</h3>
                  <div className="space-y-2">
                    {[
                      { icon: '🤖', name: 'Code Gen', desc: 'Generate scripts' },
                      { icon: '🎨', name: 'Asset Creator', desc: 'Create assets' },
                      { icon: '🧠', name: 'AI NPCs', desc: 'Smart enemies' },
                    ].map((tool, i) => (
                      <button 
                        key={i} 
                        type="button"
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-cyan-500/10 transition-all"
                        style={{ border: '1px solid rgba(0, 240, 255, 0.1)' }}
                      >
                        <span className="text-lg">{tool.icon}</span>
                        <div className="text-left">
                          <div className="font-mono text-xs" style={{ color: '#fff' }}>{tool.name}</div>
                          <div className="font-mono text-xs" style={{ color: '#6b7280' }}>{tool.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Build */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-3" style={{ color: '#00f0ff' }}>📦 Build</h3>
                  {isBuilding ? (
                    <div className="space-y-2">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ width: `${buildProgress}%`, background: 'linear-gradient(90deg, #00f0ff, #ff00aa)' }}
                        />
                      </div>
                      <p className="font-mono text-xs text-center" style={{ color: '#6b7280' }}>Building... {buildProgress}%</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {['Windows', 'macOS', 'WebGL', 'Mobile'].map((platform) => (
                        <button 
                          key={platform} 
                          type="button"
                          onClick={() => buildGame(platform)}
                          className="w-full p-2 rounded font-mono text-xs hover:bg-cyan-500/10 transition-all text-left"
                          style={{ border: '1px solid rgba(0, 240, 255, 0.1)', color: '#9ca3af' }}
                        >
                          📦 {platform}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* AI Section */}
        {activeNav === 'AI' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              🤖 AI Lab
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* AI Models */}
              <div className="lg:col-span-2 space-y-6">
                {/* Model Selector & Input */}
                <div className="rounded-xl p-6" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono font-bold" style={{ color: '#00f0ff' }}>AI Query Interface</h3>
                    <select 
                      className="p-2 rounded font-mono text-sm focus:outline-none"
                      style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      <option>GPT-5 Quantum</option>
                      <option>DALL-E 4</option>
                      <option>Whisper X</option>
                      <option>Codex Ultra</option>
                    </select>
                  </div>
                  
                  <textarea
                    className="w-full h-32 p-4 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }}
                    placeholder="Enter your prompt or question for the AI model..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1 font-mono"
                      style={{ background: 'linear-gradient(135deg, #00f0ff, #00a0cc)', color: '#000' }}
                      onClick={sendAiRequest}
                      disabled={isAiLoading || !aiPrompt.trim()}
                    >
                      {isAiLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⏳</span> Processing...
                        </span>
                      ) : (
                        '🚀 Execute Query'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="font-mono"
                      style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}
                      onClick={() => { setAiPrompt(''); setAiResponse('') }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                {/* AI Response */}
                <div className="rounded-xl p-6" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Response</h3>
                  <div 
                    className="min-h-48 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap"
                    style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.1)', color: '#e5e7eb' }}
                  >
                    {isAiLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <div className="text-4xl mb-4 animate-pulse">🧠</div>
                          <p style={{ color: '#00f0ff' }}>Processing your request...</p>
                        </div>
                      </div>
                    ) : aiResponse ? (
                      aiResponse
                    ) : (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <div className="text-4xl mb-4">💭</div>
                          <p style={{ color: '#6b7280' }}>AI response will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {aiResponse && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1 font-mono text-xs"
                        style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}
                        onClick={() => navigator.clipboard.writeText(aiResponse)}
                      >
                        📋 Copy Response
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 font-mono text-xs"
                        style={{ borderColor: 'rgba(0, 240, 255, 0.3)', color: '#00f0ff' }}
                        onClick={sendAiRequest}
                      >
                        🔄 Regenerate
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Model Status */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { name: 'GPT-5 Quantum', status: 'Active', usage: '78%', icon: '🧠', color: '#00f0ff' },
                    { name: 'DALL-E 4', status: 'Active', usage: '45%', icon: '🎨', color: '#ff00aa' },
                    { name: 'Whisper X', status: 'Active', usage: '23%', icon: '🎤', color: '#00ff88' },
                    { name: 'Codex Ultra', status: 'Standby', usage: '0%', icon: '💻', color: '#fbbf24' },
                  ].map((model, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedModel(model.name)}
                      className={`p-4 rounded-xl transition-all hover:scale-105 text-left ${selectedModel === model.name ? 'ring-2 ring-cyan-400' : ''}`}
                      style={{ background: 'rgba(0, 20, 30, 0.8)', border: `1px solid ${model.color}40` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{model.icon}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: model.status === 'Active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 170, 0, 0.2)', color: model.status === 'Active' ? '#00ff88' : '#ffaa00' }}>
                          {model.status}
                        </span>
                      </div>
                      <h4 className="font-mono font-bold text-xs mb-1" style={{ color: '#fff' }}>{model.name}</h4>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                          <div className="h-full rounded-full" style={{ width: model.usage, background: model.color }} />
                        </div>
                        <span className="font-mono text-xs" style={{ color: model.color }}>{model.usage}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Quick Prompts</h3>
                  <div className="space-y-2">
                    {[
                      { prompt: 'Explain quantum computing', icon: '⚛️' },
                      { prompt: 'Write a Python script', icon: '🐍' },
                      { prompt: 'Analyze this data', icon: '📊' },
                      { prompt: 'Generate creative ideas', icon: '💡' },
                      { prompt: 'Debug this code', icon: '🐛' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAiPrompt(item.prompt)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-cyan-500/10 text-left"
                        style={{ border: '1px solid rgba(0, 240, 255, 0.1)' }}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-mono text-xs" style={{ color: '#e5e7eb' }}>{item.prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { icon: '🚀', label: 'Start Training', color: '#00ff88' },
                      { icon: '📊', label: 'Analyze Model', color: '#00f0ff' },
                      { icon: '🔄', label: 'Fine-tune', color: '#ff00aa' },
                      { icon: '📤', label: 'Export Model', color: '#fbbf24' },
                    ].map((action, i) => (
                      <button key={i} type="button" className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 active:scale-95" style={{ background: `${action.color}15`, border: `1px solid ${action.color}30` }}>
                        <span className="text-xl">{action.icon}</span>
                        <span className="font-mono text-sm" style={{ color: action.color }}>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Resources</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'GPU Utilization', value: '67%', color: '#00f0ff' },
                      { label: 'Memory', value: '12.4 GB', color: '#ff00aa' },
                      { label: 'VRAM', value: '8.2 GB', color: '#00ff88' },
                    ].map((res, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-xs" style={{ color: '#9ca3af' }}>{res.label}</span>
                          <span className="font-mono text-xs" style={{ color: res.color }}>{res.value}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                          <div className="h-full rounded-full" style={{ width: res.value, background: res.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Copilot Section */}
        {activeNav === 'Copilot' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 font-mono" style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff' }}>
              ✈️ NEXUS Copilot
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chat Interface */}
              <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(0, 20, 40, 0.8)', borderBottom: '1px solid rgba(0, 240, 255, 0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00f0ff, #ff00aa)' }}>
                      <span className="text-xl">✈️</span>
                    </div>
                    <div>
                      <div className="font-mono font-bold" style={{ color: '#fff' }}>NEXUS Copilot</div>
                      <div className="font-mono text-xs" style={{ color: '#00ff88' }}>AI-Powered Assistant</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88' }}>● Connected</span>
                  </div>
                </div>
                
                <div className="h-80 p-4 overflow-y-auto space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00f0ff, #ff00aa)' }}>
                      <span>✈️</span>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                      <p className="font-mono text-sm" style={{ color: '#e5e7eb' }}>Hello! I'm NEXUS Copilot, your AI-powered coding assistant. I can help you with:</p>
                      <ul className="mt-2 space-y-1 font-mono text-xs" style={{ color: '#9ca3af' }}>
                        <li>• Writing and debugging code</li>
                        <li>• Explaining complex concepts</li>
                        <li>• Generating documentation</li>
                        <li>• Code review and optimization</li>
                        <li>• Architecture suggestions</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.1)' }}>
                      <p className="font-mono text-sm" style={{ color: '#e5e7eb' }}>Help me create a REST API endpoint for user authentication</p>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0, 255, 136, 0.3)' }}>
                      <span>👤</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00f0ff, #ff00aa)' }}>
                      <span>✈️</span>
                    </div>
                    <div className="p-3 rounded-lg flex-1" style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                      <p className="font-mono text-sm mb-3" style={{ color: '#e5e7eb' }}>Here's a secure REST API endpoint for user authentication:</p>
                      <div className="p-3 rounded font-mono text-xs" style={{ background: 'rgba(0, 10, 20, 0.8)', color: '#4ade80' }}>
                        <div><span style={{ color: '#c084fc' }}>POST</span> /api/auth/login</div>
                        <div className="mt-2" style={{ color: '#9ca3af' }}>{'{'}</div>
                        <div className="ml-2">"email": "user@example.com",</div>
                        <div className="ml-2">"password": "********"</div>
                        <div style={{ color: '#9ca3af' }}>{'}'}</div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>📋 Copy</button>
                        <button className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>📝 Insert</button>
                        <button className="px-2 py-1 rounded text-xs font-mono" style={{ background: 'rgba(0, 240, 255, 0.2)', color: '#00f0ff' }}>🔄 Regenerate</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
                  <div className="flex gap-2 mb-2">
                    {['💡 Suggest', '🐛 Debug', '📝 Document', '⚡ Optimize'].map((btn, i) => (
                      <button key={i} className="px-3 py-1 rounded-full text-xs font-mono transition-all hover:scale-105" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
                        {btn}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 p-3 rounded-lg font-mono text-sm" style={{ background: 'rgba(0, 10, 20, 0.8)', border: '1px solid rgba(0, 240, 255, 0.3)', color: '#fff' }} placeholder="Ask Copilot anything..." />
                    <Button className="font-mono px-6" style={{ background: 'linear-gradient(135deg, #00f0ff, #00a0cc)', color: '#000' }}>Send</Button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-4">
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Context</h3>
                  <div className="space-y-2">
                    {['📄 app.tsx', '📄 utils.ts', '📁 components/'].map((file, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ background: 'rgba(0, 240, 255, 0.05)' }}>
                        <input type="checkbox" defaultChecked={i === 0} className="rounded" />
                        <span className="font-mono text-xs" style={{ color: '#9ca3af' }}>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Suggestions</h3>
                  <div className="space-y-2">
                    {[
                      'Add error handling to login',
                      'Implement rate limiting',
                      'Add JWT refresh tokens',
                      'Create password reset flow',
                    ].map((suggestion, i) => (
                      <button key={i} className="w-full text-left p-2 rounded font-mono text-xs hover:bg-cyan-500/10 transition-all" style={{ color: '#9ca3af' }}>
                        💡 {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-xl p-4" style={{ background: 'rgba(0, 20, 30, 0.8)', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="font-mono font-bold mb-4" style={{ color: '#00f0ff' }}>Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 rounded" style={{ background: 'rgba(0, 240, 255, 0.05)' }}>
                      <div className="font-mono text-lg font-bold" style={{ color: '#00f0ff' }}>247</div>
                      <div className="font-mono text-xs" style={{ color: '#6b7280' }}>Suggestions</div>
                    </div>
                    <div className="text-center p-2 rounded" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
                      <div className="font-mono text-lg font-bold" style={{ color: '#00ff88' }}>89%</div>
                      <div className="font-mono text-xs" style={{ color: '#6b7280' }}>Accepted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Help/Documentation Modal */}
        {showHelp && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div 
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6"
              style={{ background: 'rgba(0, 10, 20, 0.98)', border: '1px solid rgba(0, 240, 255, 0.3)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-mono" style={{ color: '#00f0ff' }}>
                  📚 NEXUS OS Documentation
                </h2>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-lg hover:bg-cyan-500/10"
                  style={{ color: '#9ca3af' }}
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6 font-mono text-sm" style={{ color: '#e5e7eb' }}>
                {/* Navigation */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>🧭 Navigation</h3>
                  <p className="mb-2">Use the navigation bar at the top to switch between different sections. On mobile, tap the hamburger menu to see all options.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li><strong>Dashboard</strong> - System overview, initialization, and real-time stats</li>
                    <li><strong>Image Creation</strong> - AI-powered image generation with multiple styles</li>
                    <li><strong>IDE</strong> - Quantum code editor with syntax highlighting</li>
                    <li><strong>CLI</strong> - Command line interface with interactive commands</li>
                    <li><strong>Chat</strong> - Neural chat with AI assistant</li>
                    <li><strong>Media Desk</strong> - Media player &amp; internet radio streaming</li>
                    <li><strong>Game Creation</strong> - Game development studio with AI tools</li>
                    <li><strong>AI</strong> - AI Lab for advanced queries with model selection</li>
                    <li><strong>Copilot</strong> - AI coding assistant for development help</li>
                    <li><strong>Systems</strong> - System components and load monitoring</li>
                    <li><strong>Network</strong> - Network overview and connection status</li>
                    <li><strong>Settings</strong> - Configuration panel for preferences</li>
                  </ul>
                </section>

                {/* AI Engine */}
                <section className="p-4 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00ff88' }}>🤖 AI Engine</h3>
                  <p className="mb-2">NEXUS OS features a powerful AI engine with these capabilities:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li><strong>Image Generation</strong> - Create stunning AI-generated images from text prompts</li>
                    <li><strong>Neural Chat</strong> - Real-time AI conversation with context awareness</li>
                    <li><strong>AI Lab</strong> - Advanced queries with multiple model selection</li>
                    <li><strong>CLI Tool Fallback</strong> - Automatic fallback system for reliability</li>
                    <li><strong>High Quality Results</strong> - Professional-grade outputs for all features</li>
                  </ul>
                </section>

                {/* Image Creation */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>🎨 Image Creation</h3>
                  <p className="mb-2">Generate AI images from text descriptions:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li>Enter a descriptive prompt in the text area (be specific for best results)</li>
                    <li>Select a style: <strong>Photorealistic</strong>, <strong>Anime</strong>, <strong>3D Render</strong>, <strong>Digital Art</strong>, <strong>Oil Painting</strong>, or <strong>Watercolor</strong></li>
                    <li>Choose image size from the dropdown (1024x1024, 768x1344, etc.)</li>
                    <li>Click <strong>Generate Image</strong> and wait for the result</li>
                    <li>Use <strong>Download</strong> to save or <strong>Copy</strong> to clipboard</li>
                  </ol>
                  <p className="mt-2 text-xs" style={{ color: '#fbbf24' }}>💡 Tip: If generation fails, the CLI fallback will automatically attempt to create your image.</p>
                </section>

                {/* Chat */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>💬 Neural Chat</h3>
                  <p className="mb-2">Real-time AI chat for conversations:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li>Type your message and press <strong>Enter</strong> or click <strong>Send</strong></li>
                    <li>The AI will respond with helpful information</li>
                    <li>View timestamps on all messages</li>
                    <li>Select different contacts from the sidebar (visual feature)</li>
                  </ul>
                </section>

                {/* Media Desk */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>🎬 Media Desk Pro</h3>
                  <p className="mb-2">Multi-tab media workspace:</p>
                  
                  <h4 className="font-bold mt-3 mb-2" style={{ color: '#ff00aa' }}>📻 Radio Tab</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li>Search stations by name (e.g., BBC, Jazz, Rock, News)</li>
                    <li>Click genre tags for quick filtering (Jazz, Rock, Pop, Classical, etc.)</li>
                    <li>Click any station to start playing - player controls appear at top</li>
                    <li>Use volume slider to adjust audio level</li>
                    <li>Play/Pause/Stop controls available</li>
                    <li>30,000+ worldwide stations from Radio Browser API</li>
                    <li>Stations show country, bitrate, and tags for easy selection</li>
                  </ul>
                  
                  <h4 className="font-bold mt-3 mb-2" style={{ color: '#ff00aa' }}>🎬 Media Player Tab</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li>Upload video/audio files (MP4, WebM, MP3, WAV, OGG)</li>
                    <li>Play/Pause with button or click on video</li>
                    <li>Drag progress bar to seek through media</li>
                    <li>Volume control with mute option</li>
                    <li>Skip forward/backward buttons (10 seconds)</li>
                    <li>Export in multiple formats (MP4, WebM, GIF, MP3)</li>
                    <li>AI Tools: Auto Enhance, Smart Crop, Noise Removal, Auto Captions</li>
                  </ul>
                </section>

                {/* AI Lab */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>🤖 AI Lab</h3>
                  <p className="mb-2">Advanced AI query interface:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li>Select AI model from dropdown or click model cards</li>
                    <li>Available models: <strong>GPT-5 Quantum</strong>, <strong>DALL-E 4</strong>, <strong>Whisper X</strong>, <strong>Codex Ultra</strong></li>
                    <li>Enter your prompt or question in the text area</li>
                    <li>Click <strong>Execute Query</strong> to get response</li>
                    <li>Use Quick Prompts for common tasks (coding, analysis, creative ideas)</li>
                    <li>Copy or regenerate responses as needed</li>
                    <li>View model status and resource usage in sidebar</li>
                  </ul>
                </section>

                {/* Copilot */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>✈️ NEXUS Copilot</h3>
                  <p className="mb-2">AI-powered coding assistant:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li>Ask coding questions and get instant help</li>
                    <li>Generate code snippets in various languages</li>
                    <li>Debug code issues with explanations</li>
                    <li>Get architecture suggestions and best practices</li>
                    <li>Chat history shows previous conversation context</li>
                  </ul>
                </section>

                {/* Terminal Commands */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>⌨️ Terminal Commands</h3>
                  <p className="mb-2">Interactive CLI with these commands:</p>
                  <div className="grid grid-cols-2 gap-2 ml-4" style={{ color: '#9ca3af' }}>
                    <div><code style={{ color: '#00f0ff' }}>help</code> - Show available commands</div>
                    <div><code style={{ color: '#00f0ff' }}>status</code> - Display system status</div>
                    <div><code style={{ color: '#00f0ff' }}>neofetch</code> - System information</div>
                    <div><code style={{ color: '#00f0ff' }}>clear</code> - Clear terminal</div>
                    <div><code style={{ color: '#00f0ff' }}>matrix</code> - Enter the matrix</div>
                    <div><code style={{ color: '#00f0ff' }}>scan</code> - Scan for threats</div>
                    <div><code style={{ color: '#00f0ff' }}>evolve</code> - Trigger AI evolution</div>
                    <div><code style={{ color: '#00f0ff' }}>about</code> - About NEXUS OS</div>
                  </div>
                </section>

                {/* System */}
                <section>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00f0ff' }}>⚙️ Systems &amp; Settings</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li><strong>Systems</strong> - View component status (Neural Core, Quantum Processor, Memory Banks, Security Module, AI Subsystem, Data Pipeline) with real-time load indicators</li>
                    <li><strong>Network</strong> - Check connection status (Primary Mesh, Backup Cluster, Global CDN, Quantum Link) and traffic statistics</li>
                    <li><strong>Settings</strong> - Adjust performance sliders and toggle security features (Biometric Authentication, Quantum Encryption, Intrusion Detection)</li>
                  </ul>
                </section>

                {/* Troubleshooting */}
                <section className="p-4 rounded-lg" style={{ background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)' }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#fbbf24' }}>🔧 Troubleshooting</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: '#9ca3af' }}>
                    <li><strong>Image generation fails?</strong> Check your internet connection. The CLI fallback will activate automatically.</li>
                    <li><strong>Radio not playing?</strong> Some stations may be offline. Try a different station or search term.</li>
                    <li><strong>Chat not responding?</strong> Refresh the page and check your network connection.</li>
                    <li><strong>Slow performance?</strong> Click &quot;Initialize System&quot; on the Dashboard to ensure all subsystems are active.</li>
                    <li><strong>Mobile issues?</strong> Use the hamburger menu for navigation. Some features may require landscape orientation.</li>
                  </ul>
                </section>

                {/* Tips */}
                <section className="pt-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#00ff88' }}>💡 Pro Tips</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: '#9ca3af' }}>
                    <li>Click <strong>Initialize System</strong> on Dashboard to activate all features and see animated stats</li>
                    <li>Press <strong>Enter</strong> to quickly send chat messages</li>
                    <li>Use the <strong>❓</strong> button anytime to access this documentation</li>
                    <li>Radio continues playing while browsing other sections</li>
                    <li>Generated images are saved locally in your session for download</li>
                    <li>Try different image styles - each has unique characteristics</li>
                    <li>Terminal commands work in real-time with colored output</li>
                  </ul>
                </section>
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}>
                <p className="font-mono text-xs" style={{ color: '#6b7280' }}>
                  Powered by NEXUS AI • Neural Network Active
                </p>
                <Button
                  onClick={() => setShowHelp(false)}
                  style={{ background: 'linear-gradient(135deg, #00f0ff, #00a0cc)', color: '#000' }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer
          className="relative z-20 border-t mt-16 py-8"
          style={{ borderColor: 'rgba(0, 240, 255, 0.2)' }}
        >
          <div className="container mx-auto px-4 text-center">
            <p className="font-mono text-sm" style={{ color: '#6b7280' }}>
              © 2024 NEXUS Corporation. {systemActive ? 'All systems operational.' : 'System in standby mode.'}
            </p>
            <p className="font-mono text-xs mt-2" style={{ color: '#4b5563' }}>
              &quot;The future is sentient.&quot;
            </p>
          </div>
        </footer>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes scan-line {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes glitch {
          0%, 100% {
            text-shadow:
              0 0 10px #00f0ff,
              0 0 20px #00f0ff;
            transform: translate(0);
          }
          25% {
            text-shadow:
              -3px 0 #ff00aa,
              3px 0 #00f0ff;
            transform: translate(-2px, 1px);
          }
          50% {
            text-shadow:
              3px 0 #ff00aa,
              -3px 0 #00f0ff;
            transform: translate(2px, -1px);
          }
          75% {
            text-shadow:
              0 0 10px #00f0ff,
              0 0 20px #00f0ff;
            transform: translate(0);
          }
        }

        @keyframes slide-down {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .glitch-effect {
          animation: glitch 0.15s ease-in-out;
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 10, 20, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00f0ff, #ff00aa);
          border-radius: 3px;
        }
      `}</style>
    </main>
  )
}
