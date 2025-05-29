/**
 * 随机昵称生成器
 * 生成口语化、有趣的随机昵称
 */
export class NicknameGenerator {
  // 形容词库 - 扩大词库
  private static adjectives = [
    // 性格类
    '聪明的', '勤奋的', '可爱的', '温柔的', '活泼的', '开朗的', '阳光的', '甜美的',
    '机智的', '幽默的', '善良的', '热情的', '乐观的', '友善的', '温暖的', '快乐的',
    '纯真的', '调皮的', '文艺的', '清新的', '优雅的', '淡定的', '潇洒的', '酷酷的',
    '呆萌的', '软萌的', '元气满满的', '充满活力的', '爱笑的', '爱美的', '爱吃的',
    '努力的', '上进的', '认真的', '专注的', '细心的', '贴心的', '暖心的', '用心的',
    '有趣的', '好奇的', '探索的', '冒险的', '勇敢的', '坚强的', '独立的', '自信的',
    
    // 状态类
    '快乐的', '幸福的', '满足的', '惬意的', '舒适的', '安静的', '平静的', '悠闲的',
    '忙碌的', '积极的', '主动的', '热血的', '激情的', '兴奋的', '开心的', '愉悦的',
    '轻松的', '自由的', '洒脱的', '豁达的', '大方的', '慷慨的', '包容的', '宽容的',
    
    // 外观类
    '帅气的', '美丽的', '俊俏的', '精致的', '漂亮的', '好看的', '迷人的', '动人的',
    '高挑的', '娇小的', '苗条的', '健康的', '强壮的', '灵巧的', '敏捷的', '柔软的',
    
    // 特色类
    '神秘的', '特别的', '独特的', '稀有的', '珍贵的', '宝贵的', '难得的', '罕见的',
    '普通的', '平凡的', '朴实的', '真诚的', '实在的', '踏实的', '稳重的', '靠谱的',
    '新鲜的', '年轻的', '青春的', '朝气的', '蓬勃的', '生机的', '鲜活的', '灵动的',
    
    // 技能类
    '擅长的', '专业的', '资深的', '经验丰富的', '技术精湛的', '手艺高超的',
    '多才多艺的', '全能的', '万能的', '厉害的', '牛逼的', '给力的', '强悍的',
    
    // 网络流行语类
    '佛系的', '躺平的', '卷王', '内卷的', '摸鱼的', '打工的', '社畜', '996的',
    '干饭的', '吃瓜的', '追剧的', '熬夜的', '早起的', '运动的', '健身的', '养生的',
    '二次元的', '宅家的', '出门的', '旅行的', '拍照的', '自拍的', '直播的', '网红'
  ]

  // 名词库 - 大幅扩展
  private static nouns = [
    // 水果系列
    '小苹果', '小香蕉', '小橘子', '小草莓', '小葡萄', '小桃子', '小梨子', '小西瓜',
    '小樱桃', '小柠檬', '小芒果', '小菠萝', '小猕猴桃', '小火龙果', '小榴莲', '小椰子',
    '小蓝莓', '小荔枝', '小龙眼', '小杨梅', '小石榴', '小橙子', '小柚子', '小哈密瓜',
    '小木瓜', '小牛油果', '小百香果', '小山竹', '小红毛丹', '小莲雾', '小枇杷',
    
    // 水果职业
    '水果达人', '水果专家', '水果爱好者', '水果收集家', '水果品鉴师', '水果小贩',
    '果农', '果商', '果友', '果粉', '果迷', '果控', '果痴', '果神', '果王', '果后',
    '水果猎人', '水果探险家', '水果研究员', '水果博士', '水果教授', '水果大师',
    '水果网红', '水果主播', '水果UP主', '水果博主', '水果测评师', '水果推荐官',
    
    // 通用昵称
    '小王', '小李', '小张', '小刘', '小陈', '小林', '小黄', '小吴', '小赵', '小周',
    '小明', '小红', '小美', '小花', '小雨', '小雪', '小月', '小星', '小云', '小风',
    '小鱼', '小鸟', '小猫', '小狗', '小兔', '小熊', '小虎', '小龙', '小凤', '小鹿',
    
    // 职业角色
    '吃货', '美食家', '健康达人', '养生专家', '营养师', '厨师', '老板', '店主',
    '顾客', '会员', '用户', '朋友', '伙伴', '同学', '同事', '邻居', '室友', '网友',
    '主播', 'UP主', '博主', '网红', '达人', '大V', '粉丝', '观众', '听众', '读者',
    
    // 动物系列
    '小猫咪', '小狗狗', '小兔子', '小熊猫', '小企鹅', '小海豚', '小考拉', '小袋鼠',
    '小松鼠', '小仓鼠', '小刺猬', '小狐狸', '小浣熊', '小獾', '小水獭', '小海狮',
    
    // 自然元素
    '小太阳', '小月亮', '小星星', '小彩虹', '小白云', '小雪花', '小露珠', '小花朵',
    '小树苗', '小嫩芽', '小叶子', '小石头', '小贝壳', '小珍珠', '小宝石', '小钻石',
    
    // 现代网络词汇
    '打工人', '社畜', '程序员', '设计师', '学生党', '上班族', '创业者', '自由职业者',
    '斜杠青年', '数码达人', '科技控', '游戏玩家', '二次元', '追星族', '颜值党',
    '养生党', '健身达人', '跑步爱好者', '瑜伽达人', '舞蹈家', '音乐人', '摄影师',
    
    // 生活状态
    '早起鸟', '夜猫子', '午睡王', '干饭人', '减肥达人', '增肌狂魔', '学霸', '学渣',
    '书虫', '影迷', '剧迷', '球迷', '车迷', '花痴', '购物狂', '旅行者', '宅男', '宅女',
    
    // 特色标签
    '小仙女', '小天使', '小恶魔', '小公主', '小王子', '小可爱', '小甜心', '小宝贝',
    '小机灵', '小聪明', '小糊涂', '小迷糊', '小马虎', '小细心', '小温柔', '小霸王',
    
    // 季节时间
    '春天', '夏日', '秋天', '冬日', '清晨', '午后', '黄昏', '夜晚', '周一', '周末',
    '假期', '工作日', '节日', '生日', '纪念日', '特殊日'
  ]

  // 扩展特殊模板
  private static specialTemplates = [
    // 水果相关
    () => `${NicknameGenerator.getRandomItem(['爱吃', '喜欢', '钟爱', '迷恋', '痴迷'])}${NicknameGenerator.getRandomItem(['苹果', '香蕉', '草莓', '葡萄', '橘子', '芒果', '桃子', '樱桃'])}的${NicknameGenerator.getRandomItem(['小可爱', '小天使', '小仙女', '小王子', '小公主', '小宝贝', '达人'])}`,
    
    () => `${NicknameGenerator.getRandomItem(['每天', '天天', '经常', '总是', '喜欢'])}${NicknameGenerator.getRandomItem(['吃水果', '买水果', '分享水果', '推荐水果', '研究水果'])}的${NicknameGenerator.getRandomItem(['小伙伴', '好朋友', '达人', '专家', '老师'])}`,
    
    () => `${NicknameGenerator.getRandomItem(['超级', '特级', '资深', '专业', '骨灰级'])}${NicknameGenerator.getRandomItem(['水果迷', '果粉', '吃货', '美食家', '健康达人', '养生党'])}`,
    
    () => `${NicknameGenerator.getRandomItem(['来自', '住在', '生活在'])}${NicknameGenerator.getRandomItem(['果园', '农场', '山谷', '田野', '乡村', '城市'])}的${NicknameGenerator.getRandomItem(['小农夫', '果农', '园主', '种植户', '收获者'])}`,
    
    // 生活状态
    () => `${NicknameGenerator.getRandomItem(['梦想成为', '立志做', '想当', '努力成为'])}${NicknameGenerator.getRandomItem(['水果大王', '果业老板', '健康专家', '营养师', '美食博主', '生活达人'])}`,
    
    () => `${NicknameGenerator.getRandomItem(['今天也要', '每天都要', '一直要', '永远要'])}${NicknameGenerator.getRandomItem(['开心', '快乐', '健康', '美美哒', '元气满满', '充满活力'])}的${NicknameGenerator.getRandomItem(['小天使', '小可爱', '宝贝', '小太阳', '小公主'])}`,
    
    // 网络流行语
    () => `${NicknameGenerator.getRandomItem(['佛系', '躺平', '摸鱼', '干饭', '熬夜', '早起'])}${NicknameGenerator.getRandomItem(['达人', '专家', '选手', '王者', '高手', '大师'])}`,
    
    () => `${NicknameGenerator.getRandomItem(['打工', '上班', '学习', '工作', '创业'])}之余爱吃${NicknameGenerator.getRandomItem(['水果', '苹果', '香蕉', '草莓'])}的${NicknameGenerator.getRandomItem(['小青年', '年轻人', '少年', '青春期'])}`,
    
    // 时间地点
    () => `${NicknameGenerator.getRandomItem(['春日', '夏日', '秋日', '冬日', '清晨', '午后', '黄昏'])}${NicknameGenerator.getRandomItem(['阳光下', '微风中', '雨后', '雪中'])}的${NicknameGenerator.getRandomItem(['小水果', '果香', '甜蜜', '清香'])}`,
    
    () => `${NicknameGenerator.getRandomItem(['北方', '南方', '东部', '西部', '山区', '海边'])}${NicknameGenerator.getRandomItem(['爱水果', '种水果', '卖水果'])}的${NicknameGenerator.getRandomItem(['小朋友', '年轻人', '老板', '农民'])}`,
    
    // 数字系列
    () => `${NicknameGenerator.getRandomItem(['第一', '唯一', '最后一个', '这届'])}${NicknameGenerator.getRandomItem(['爱吃水果', '研究水果', '推广水果'])}的${NicknameGenerator.getRandomItem(['小能手', '达人', '专家', '学生'])}`
  ]

  // 扩展季节主题
  private static seasonalNicknames = [
    '春天的小草莓', '夏日的小西瓜', '秋天的小苹果', '冬日的小橘子',
    '春暖花开小果农', '夏日清凉果汁王', '秋收满满果商', '冬日暖心果茶师',
    '春风中的樱桃', '夏雨后的荔枝', '秋霜下的柿子', '冬雪里的冬枣',
    '踏春赏花果农', '避暑纳凉瓜农', '秋游采摘达人', '冬藏果香专家'
  ]

  // 扩展时间主题
  private static timeBasedNicknames = [
    '早起的小鸟爱吃果', '午后阳光果茶时光', '夜晚月光下的果农',
    '周一元气水果达人', '周末休闲果汁王', '假期快乐小果粉',
    '清晨露珠果园主', '正午烈日采摘工', '傍晚夕阳果商',
    '深夜修仙吃水果', '凌晨三点小饿鬼', '黄昏时分果香飘'
  ]

  /**
   * 生成随机昵称
   */
  static generateNickname(): string {
    const generators = [
      () => NicknameGenerator.generateBasicNickname(),
      () => NicknameGenerator.generateSpecialNickname(),
      () => NicknameGenerator.generateSeasonalNickname(),
      () => NicknameGenerator.generateTimeBasedNickname(),
      () => NicknameGenerator.generateNumberNickname()
    ]

    const randomGenerator = NicknameGenerator.getRandomItem(generators)
    return randomGenerator()
  }

  /**
   * 生成基础昵称 (形容词 + 名词)
   */
  private static generateBasicNickname(): string {
    const adjective = NicknameGenerator.getRandomItem(NicknameGenerator.adjectives)
    const noun = NicknameGenerator.getRandomItem(NicknameGenerator.nouns)
    return `${adjective}${noun}`
  }

  /**
   * 生成特殊模板昵称
   */
  private static generateSpecialNickname(): string {
    const template = NicknameGenerator.getRandomItem(NicknameGenerator.specialTemplates)
    return template()
  }

  /**
   * 生成季节主题昵称
   */
  private static generateSeasonalNickname(): string {
    return NicknameGenerator.getRandomItem(NicknameGenerator.seasonalNicknames)
  }

  /**
   * 生成时间主题昵称
   */
  private static generateTimeBasedNickname(): string {
    return NicknameGenerator.getRandomItem(NicknameGenerator.timeBasedNicknames)
  }

  /**
   * 生成带数字的昵称
   */
  private static generateNumberNickname(): string {
    const adjective = NicknameGenerator.getRandomItem(NicknameGenerator.adjectives)
    const noun = NicknameGenerator.getRandomItem(NicknameGenerator.nouns)
    const number = Math.floor(Math.random() * 999) + 1
    
    const formats = [
      `${adjective}${noun}${number}`,
      `${adjective}${noun}${number}号`,
      `${number}号${adjective}${noun}`,
      `${adjective}${noun}_${number}`
    ]
    
    return NicknameGenerator.getRandomItem(formats)
  }

  /**
   * 从数组中随机选择一个元素
   */
  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * 生成多个昵称供选择
   */
  static generateMultipleNicknames(count: number = 5): string[] {
    const nicknames = new Set<string>()
    
    while (nicknames.size < count) {
      nicknames.add(NicknameGenerator.generateNickname())
    }
    
    return Array.from(nicknames)
  }

  /**
   * 根据用户偏好生成昵称
   */
  static generateNicknameByPreference(preference?: 'cute' | 'cool' | 'funny' | 'professional'): string {
    switch (preference) {
      case 'cute':
        return NicknameGenerator.generateCuteNickname()
      case 'cool':
        return NicknameGenerator.generateCoolNickname()
      case 'funny':
        return NicknameGenerator.generateFunnyNickname()
      case 'professional':
        return NicknameGenerator.generateProfessionalNickname()
      default:
        return NicknameGenerator.generateNickname()
    }
  }

  /**
   * 生成可爱风格昵称
   */
  private static generateCuteNickname(): string {
    const cuteAdjectives = ['可爱的', '甜美的', '软萌的', '呆萌的', '小小的', '粉嫩的']
    const cuteNouns = ['小苹果', '小草莓', '小樱桃', '小桃子', '小可爱', '小天使', '小公主']
    
    return `${NicknameGenerator.getRandomItem(cuteAdjectives)}${NicknameGenerator.getRandomItem(cuteNouns)}`
  }

  /**
   * 生成酷炫风格昵称
   */
  private static generateCoolNickname(): string {
    const coolAdjectives = ['酷酷的', '潇洒的', '帅气的', '独立的', '自信的', '强悍的']
    const coolNouns = ['水果王者', '果业大亨', '水果猎人', '果神', '水果达人', '果控']
    
    return `${NicknameGenerator.getRandomItem(coolAdjectives)}${NicknameGenerator.getRandomItem(coolNouns)}`
  }

  /**
   * 生成幽默风格昵称
   */
  private static generateFunnyNickname(): string {
    const funnyTemplates = [
      () => `吃了${NicknameGenerator.getRandomItem(['100个', '999个', '一车'])}${NicknameGenerator.getRandomItem(['苹果', '香蕉', '橘子'])}的${NicknameGenerator.getRandomItem(['大胃王', '吃货', '小怪兽'])}`,
      () => `${NicknameGenerator.getRandomItem(['专业', '资深', '骨灰级'])}${NicknameGenerator.getRandomItem(['挑水果', '吃水果', '种水果'])}${NicknameGenerator.getRandomItem(['选手', '专家', '达人'])}`,
      () => `${NicknameGenerator.getRandomItem(['逃跑', '流浪', '迷路'])}的${NicknameGenerator.getRandomItem(['小苹果', '水果贩', '果农'])}`,
    ]
    
    const template = NicknameGenerator.getRandomItem(funnyTemplates)
    return template()
  }

  /**
   * 生成专业风格昵称
   */
  private static generateProfessionalNickname(): string {
    const professionalAdjectives = ['专业的', '资深的', '经验丰富的', '认真的', '专注的']
    const professionalNouns = ['水果品鉴师', '营养师', '健康顾问', '果业专家', '农业顾问']
    
    return `${NicknameGenerator.getRandomItem(professionalAdjectives)}${NicknameGenerator.getRandomItem(professionalNouns)}`
  }

  /**
   * 验证昵称是否合适
   */
  static validateNickname(nickname: string): boolean {
    // 检查长度
    if (nickname.length < 2 || nickname.length > 20) {
      return false
    }
    
    // 检查是否包含不当词汇（这里可以扩展敏感词过滤）
    const inappropriateWords = ['测试', '管理员', 'admin', 'test']
    return !inappropriateWords.some(word => nickname.toLowerCase().includes(word.toLowerCase()))
  }

  /**
   * 获取昵称生成统计信息
   */
  static getGeneratorStats(): {
    totalAdjectives: number
    totalNouns: number
    totalCombinations: number
    specialTemplates: number
  } {
    return {
      totalAdjectives: NicknameGenerator.adjectives.length,
      totalNouns: NicknameGenerator.nouns.length,
      totalCombinations: NicknameGenerator.adjectives.length * NicknameGenerator.nouns.length,
      specialTemplates: NicknameGenerator.specialTemplates.length
    }
  }
}

// 导出便捷方法
export const generateRandomNickname = () => NicknameGenerator.generateNickname()
export const generateNicknamesByPreference = (preference?: 'cute' | 'cool' | 'funny' | 'professional') => 
  NicknameGenerator.generateNicknameByPreference(preference)
export const generateMultipleNicknames = (count?: number) => 
  NicknameGenerator.generateMultipleNicknames(count)
