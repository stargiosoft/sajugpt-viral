'use client';

import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
}

export default function GhostLanding({
  onStart,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100dvh',
        padding: '40px 24px 120px',
        background:
          'radial-gradient(circle at center,#25153a 0%,#09070d 55%,#000 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >

      {/* 안개 효과 */}
      <motion.div
        animate={{ x: [0, 40, 0], opacity: [0.15,0.3,0.15], }}
        transition={{ duration:8, repeat:Infinity, }}
        style={{ position:'absolute', width:500, height:500, 
          background:'radial-gradient(circle,#8b5cf6,transparent 70%)',
          filter:'blur(80px)',
          top:'20%',
          left:'50%',
          transform:'translateX(-50%)',
        }}
      />
      <div
        className="flex flex-col items-center justify-center"
        style={{
          minHeight:'calc(100dvh - 200px)',
          position:'relative',
          zIndex:2,
        }}
      >

        {/* 귀신 실루엣 */}
        <motion.div
          animate={{ y:[0,-10,0], opacity:[0.6,1,0.6], }}
          transition={{ duration:4, repeat:Infinity, }}
          style={{
            fontSize:70,
            filter:'drop-shadow(0 0 25px #8b5cf6)',
            marginBottom:20,
          }}
        >
          ◉
        </motion.div>

        {/* 제목 */}
        <motion.h1
          initial={{ opacity:0, scale:0.8, }}
          animate={{ opacity:1, scale:1, }}
          transition={{ delay:.3, }}
          style={{
            fontSize:36,
            fontWeight:900,
            color:'#fff',
            letterSpacing:'-2px',
            textShadow: '0 0 10px #8b5cf6,0 0 30px #5b21b6',
            marginBottom:20,
          }}
        >
          귀신 타로
        </motion.h1>

        <motion.p
          initial={{ opacity:0, }}
          animate={{ opacity:1,}}
          transition={{ delay:.6, }}
          style={{
            color:'#c4b5fd',
            fontSize:16,
            lineHeight:1.8,
            textAlign:'center',
          }}
        >
          {`어둠 속에서 기다리던 존재가
          당신의 미래를 속삭입니다.`}
        </motion.p>

        {/* 구분선 */}
        <motion.div
          animate={{ opacity:[0.3,1,0.3],}}
          transition={{ duration:2, repeat:Infinity,}}
          style={{
            width:260,
            height:1,
            background:'#7c3aed',
            marginTop:45,
            marginBottom:35,
          }}
        />

        {/* 카드 */}
        <div
          className="grid grid-cols-5 gap-3"
        >
          {
            Array.from({length:10}).map((_,i)=>(
              <motion.div
                key={i}
                initial={{ opacity:0, rotateY:90, }}
                animate={{ opacity:1, rotateY:[0,10,0], y:[0,-8,0], }}
                transition={{ delay:1+i*.08, duration:3, repeat:Infinity, }}
                style={{
                  width:52,
                  height:78,
                  borderRadius:12,
                  background: 'linear-gradient(145deg,#140b20,#050505)',
                  border: '1px solid #6d28d9',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  color:'#a78bfa',
                  fontSize:22,
                  boxShadow: '0 0 25px rgba(124,58,237,.4)',
                }}
              >
                ☠
              </motion.div>
            ))
          }
        </div>

        <motion.p
          animate={{ opacity:[.5,1,.5], }}
          transition={{ duration:3, repeat:Infinity, }}
          style={{
            marginTop:35,
            color:'#a78bfa',
            textAlign:'center',
            lineHeight:1.8,
          }}
        >
          마음이 끌리는 카드 한 장을<br/>
          선택하세요.<br/>
          <span style={{fontSize:13}}>
            선택한 순간, 이야기는 시작됩니다.
          </span>
        </motion.p>
      </div>

      {/* 버튼 */}
      <div
        className="fixed left-0 right-0 bottom-0 flex justify-center"
        style={{
          padding:'16px 24px',
          paddingBottom: 'max(16px,env(safe-area-inset-bottom))',
          zIndex:10,
        }}
      >

        <motion.button
          onClick={onStart}
          whileTap={{ scale:.95, }}
          animate={{
            boxShadow:[
              '0 0 20px rgba(139,92,246,.3)',
              '0 0 40px rgba(139,92,246,.8)',
              '0 0 20px rgba(139,92,246,.3)',
            ],
          }}
          transition={{ duration:2, repeat:Infinity, }}
          style={{
            width:'100%',
            maxWidth:440,
            height:58,
            borderRadius:16,
            background: 'linear-gradient(90deg,#4c1d95,#7c3aed)',
            color:'#fff',
            border:'1px solid #a78bfa',
            fontSize:18,
            fontWeight:800,
          }}
        >
          👁 봉인된 카드 열기
        </motion.button>
      </div>
    </motion.div>
  );
}