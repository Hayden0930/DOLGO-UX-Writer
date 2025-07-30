// DOLGO UX Writer - 한국어 UX Writing 친근한 톤 변환 및 분석 플러그인
// 선택된 텍스트 노드의 문장을 분석하고 친근한 톤으로 변경합니다.

figma.showUI(__html__, { width: 450, height: 600 });

// 한국어 UX Writing 친근한 톤 변환 규칙
const friendlyToneRules: { [key: string]: string } = {
  // 돌고만의 기본 용어 시스템 반영
  '나눔': '기부',
  '후원': '기부',
  '함께하기': '기부',
  '나누기': '배분',
  '정기모금': '정기사연',
  '일시모금': '일시사연',
  '메시지': '댓글',
  '설립': '개설',
  '재단': '기부재단',

  // 명령형 → 친근한 제안형
  '해보세요': '해보기',
  '확인해보세요': '확인하기',
  '시도해보세요': '시도하기',
  '테스트해보세요': '테스트하기',
  '체험해보세요': '체험하기',
  '사용해보세요': '사용하기',
  '이용해보세요': '이용하기',
  '다운로드해보세요': '다운로드하기',
  '설치해보세요': '설치하기',
  '가입해보세요': '가입하기',
  '로그인해보세요': '로그인하기',
  '회원가입해보세요': '회원가입하기',
  
  // 격식체 → 친근체
  '합니다': '해요',
  '됩니다': '돼요',
  '입니다': '이에요',
  '설정합니다': '설정해요',
  '저장합니다': '저장해요',
  '삭제합니다': '삭제해요',
  '수정합니다': '수정해요',
  '업데이트합니다': '업데이트해요',
  '다운로드합니다': '다운로드해요',
  '업로드합니다': '업로드해요',
  
  // 부정적 표현 → 긍정적 표현
  '실패했습니다': '다시 시도해보세요',
  '오류가 발생했습니다': '잠시 후 다시 시도해보세요',
  '연결할 수 없습니다': '인터넷 연결을 확인해보세요',
  '찾을 수 없습니다': '다른 방법으로 찾아보세요',
  
  // 긴 문장 → 간결한 표현
  '이 기능을 사용하시려면': '이 기능을 사용하려면',
  '위의 내용을 확인하신 후': '위 내용을 확인한 후',
  '아래의 버튼을 클릭하시면': '아래 버튼을 클릭하면'
};

// 문장 스타일 분석 함수
function analyzeSentenceStyle(text: string): string {
  const patterns = {
    command: /[해보세요|하세요|하십시오|해주세요]$/,
    question: /[까요|나요|인가요|일까요]$/,
    statement: /[입니다|합니다|됩니다|이에요|해요|돼요]$/
  };
  
  if (patterns.command.test(text)) return '명령문';
  if (patterns.question.test(text)) return '의문문';
  if (patterns.statement.test(text)) return '서술문';
  return '기타';
}

// 감정 톤 분석 함수
function analyzeEmotionTone(text: string): string {
  const friendlyWords = ['해보기', '해요', '돼요', '이에요', '~해보세요'];
  const professionalWords = ['합니다', '됩니다', '입니다', '설정', '관리'];
  const casualWords = ['야', '어', '응', '그래'];
  
  let friendlyCount = 0;
  let professionalCount = 0;
  let casualCount = 0;
  
  friendlyWords.forEach(word => {
    if (text.includes(word)) friendlyCount++;
  });
  
  professionalWords.forEach(word => {
    if (text.includes(word)) professionalCount++;
  });
  
  casualWords.forEach(word => {
    if (text.includes(word)) casualCount++;
  });
  
  if (friendlyCount > professionalCount && friendlyCount > casualCount) return 'friendly';
  if (professionalCount > friendlyCount && professionalCount > casualCount) return 'professional';
  if (casualCount > friendlyCount && casualCount > professionalCount) return 'casual';
  return 'neutral';
}

// 키워드 빈도 분석 함수
function analyzeKeywords(text: string): { [key: string]: number } {
  const keywords = text.match(/[가-힣]+/g) || [];
  const frequency: { [key: string]: number } = {};
  
  keywords.forEach(keyword => {
    if (keyword.length > 1) { // 1글자 제외
      frequency[keyword] = (frequency[keyword] || 0) + 1;
    }
  });
  
  return frequency;
}

// UX Tone 프로파일 생성 함수
function generateUXToneProfile(texts: string[]): any {
  const profiles = {
    sentenceStyles: { 명령문: 0, 의문문: 0, 서술문: 0, 기타: 0 } as { [key: string]: number },
    emotionTones: { friendly: 0, professional: 0, casual: 0, neutral: 0 } as { [key: string]: number },
    keywords: {} as { [key: string]: number },
    totalTexts: texts.length,
    averageLength: 0
  };
  
  let totalLength = 0;
  
  texts.forEach(text => {
    // 문장 스타일 분석
    const style = analyzeSentenceStyle(text);
    profiles.sentenceStyles[style]++;
    
    // 감정 톤 분석
    const emotion = analyzeEmotionTone(text);
    profiles.emotionTones[emotion]++;
    
    // 키워드 분석
    const keywords = analyzeKeywords(text);
    Object.keys(keywords).forEach(keyword => {
      profiles.keywords[keyword] = (profiles.keywords[keyword] || 0) + keywords[keyword];
    });
    
    totalLength += text.length;
  });
  
  profiles.averageLength = Math.round(totalLength / texts.length);
  
  return profiles;
}

// 텍스트를 친근한 톤으로 변환하는 함수
function convertToFriendlyTone(text: string): string {
  let convertedText = text;
  
  // 규칙에 따라 텍스트 변환
  for (const formal in friendlyToneRules) {
    const friendly = friendlyToneRules[formal];
    convertedText = convertedText.replace(new RegExp(formal, 'g'), friendly);
  }
  
  return convertedText;
}

// 폰트 로딩 함수
async function loadFontsForNode(textNode: TextNode): Promise<void> {
  try {
    const fontName = textNode.fontName as FontName;
    await figma.loadFontAsync(fontName);
  } catch (error) {
    console.error('폰트 로딩 실패:', error);
  }
}

// Frame 내의 모든 텍스트 노드 찾기
function findAllTextNodesInFrame(frame: FrameNode): TextNode[] {
  const textNodes: TextNode[] = [];
  
  function traverse(node: SceneNode) {
    if (node.type === 'TEXT') {
      textNodes.push(node as TextNode);
    } else if ('children' in node) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  traverse(frame);
  return textNodes;
}

// 선택된 노드들에서 텍스트 노드 추출
function extractTextNodesFromSelection(selection: readonly SceneNode[]): TextNode[] {
  const textNodes: TextNode[] = [];
  
  for (const node of selection) {
    if (node.type === 'TEXT') {
      textNodes.push(node as TextNode);
    } else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'INSTANCE' || node.type === 'COMPONENT') {
      // Frame, Group, Instance, Component 내의 모든 텍스트 노드 찾기
      const frameTextNodes = findAllTextNodesInFrame(node as FrameNode);
      textNodes.push(...frameTextNodes);
    }
  }
  
  return textNodes;
}

// 선택된 텍스트 노드 분석
async function analyzeSelectedTextNodes(): Promise<any> {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    return { error: '텍스트 노드나 Frame을 선택해주세요!' };
  }
  
  // 선택된 노드들에서 텍스트 노드 추출
  const textNodes = extractTextNodesFromSelection(selection);
  
  if (textNodes.length === 0) {
    return { error: '분석할 텍스트가 없습니다. 텍스트 노드나 텍스트가 포함된 Frame을 선택해주세요.' };
  }
  
  const texts: string[] = [];
  const validTextNodes: TextNode[] = [];
  
  for (const textNode of textNodes) {
    const text = textNode.characters;
    if (text.trim()) {
      texts.push(text);
      validTextNodes.push(textNode);
    }
  }
  
  if (texts.length === 0) {
    return { error: '분석할 텍스트가 없습니다.' };
  }
  
  // UX Tone 프로파일 생성
  const profile = generateUXToneProfile(texts);
  
  // 변환 가능한 항목 미리보기 생성
  const previews = texts.map((text, index) => ({
    original: text,
    converted: convertToFriendlyTone(text),
    hasChanges: text !== convertToFriendlyTone(text),
    nodeId: validTextNodes[index].id,
    nodeName: validTextNodes[index].name || '텍스트'
  }));
  
  return {
    profile,
    previews,
    textNodes: validTextNodes.map(node => node.id),
    totalNodes: textNodes.length,
    selectedFrames: selection.filter(node => 
      node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'INSTANCE' || node.type === 'COMPONENT'
    ).length
  };
}

// 선택된 텍스트 노드 처리
async function processSelectedTextNodes() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.notify('텍스트 노드나 Frame을 선택해주세요!');
    return;
  }
  
  // 선택된 노드들에서 텍스트 노드 추출
  const textNodes = extractTextNodesFromSelection(selection);
  
  if (textNodes.length === 0) {
    figma.notify('처리할 텍스트가 없습니다.');
    return;
  }
  
  let processedCount = 0;
  
  for (const textNode of textNodes) {
    try {
      // 폰트 로딩
      await loadFontsForNode(textNode);
      
      const originalText = textNode.characters;
      const convertedText = convertToFriendlyTone(originalText);
      
      if (originalText !== convertedText) {
        textNode.characters = convertedText;
        processedCount++;
      }
    } catch (error) {
      console.error('텍스트 처리 실패:', error);
      figma.notify('일부 텍스트 처리에 실패했습니다.');
    }
  }
  
  if (processedCount > 0) {
    figma.notify(`${processedCount}개의 텍스트가 친근한 톤으로 변경되었습니다!`);
  } else {
    figma.notify('변경할 텍스트가 없습니다.');
  }
}

// UI에서 메시지 수신
figma.ui.onmessage = async (msg: { type: string; data?: any }) => {
  if (msg.type === 'analyze-text') {
    const result = await analyzeSelectedTextNodes();
    figma.ui.postMessage({ type: 'analysis-result', data: result });
  } else if (msg.type === 'convert-text') {
    await processSelectedTextNodes();
  } else if (msg.type === 'apply-selected') {
    // 선택된 항목만 적용
    if (msg.data && msg.data.selectedItems) {
      let processedCount = 0;
      
      // 비동기로 노드들을 처리
      await Promise.all(
        msg.data.selectedItems.map(async (item: any) => {
          try {
            const node = await figma.getNodeByIdAsync(item.nodeId);
            if (node && node.type === 'TEXT') {
              const textNode = node as TextNode;
              // 폰트 로딩
              await loadFontsForNode(textNode);
              textNode.characters = item.converted;
              processedCount++;
            }
          } catch (error) {
            console.error('Node not found:', item.nodeId);
          }
        })
      );
      
      figma.notify(`${processedCount}개의 텍스트가 변경되었습니다!`);
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
