export interface Song {
  id: number;
  title: string;
  lyrics: string;
  lyricsEn?: string;
  funFacts?: string;
}

export const songs: Song[] = [
  {
    id: 1,
    title: "Helan Går",
    lyrics: "Helan går\nSjung hopp faderallan lallan lej\nHelan går\nSjung hopp faderallan lej\nOch den som inte helan tar\nHan heller inte halvan får\nHelan går\nSjung hopp faderallan lej!",
    lyricsEn: "The whole one goes\nSing hoop faderallan lallan lay\nThe whole one goes\nSing hoop faderallan lay\nAnd he who doesn't take the whole\nWon't get the half one either\nThe whole one goes\nSing hoop faderallan lay!",
    funFacts: "\"Helan Går\" is one of the most well-known Swedish drinking songs. It dates back to the 18th century and is traditionally sung before taking a shot of snaps (Swedish schnapps). The song is part of a series where each verse corresponds to a numbered drink.",
  },
  {
    id: 2,
    title: "Studentsången",
    lyrics: "Sjung om studentens lyckliga dag!\nLåt oss glömma det tunga,\nFjäriln leker i solens drag,\nDrömmarna äro de unga.\nDet brinner en eld i varje barm,\nDe unga gå fram med hoppet i famn!\nSjung om studentens lyckliga dag!",
    lyricsEn: "Sing about the student's happy day!\nLet us forget the heavy,\nThe butterfly plays in the sun's pull,\nDreams belong to the young.\nA fire burns in every chest,\nThe young march forward with hope in their arms!\nSing about the student's happy day!",
    funFacts: "Studentsången is a classic Scandinavian student anthem sung at graduations and student gatherings. It celebrates the joy and optimism of student life.",
  },
  {
    id: 3,
    title: "Härjaansen",
    lyrics: "Härjaansen, härjaansen\nVi dricker och vi sjunger\nOch alla glada stunder\nDe varar livet ut\nHärjaansen, härjaansen\nVi lever medan vi kan!",
    lyricsEn: "Let loose, let loose\nWe drink and we sing\nAnd all happy moments\nThey last a lifetime\nLet loose, let loose\nWe live while we can!",
    funFacts: "A popular drinking song at Hanken student events and sitz parties. The word 'Härjaansen' roughly means 'let loose' or 'go wild'.",
  },
  {
    id: 4,
    title: "Internationalen",
    lyrics: "Upp trälar uti alla stater,\nsom hungern bjudit till sitt bord.\nDet dånar uti skog och krater,\nsnart skördar vi vår sista gröda jord.\nAllt vad vi skapat skall vi äga,\nens ha vi intet, allt vi få.",
    lyricsEn: "Rise up, servants in all states,\nwhom hunger has invited to its table.\nIt thunders in forest and crater,\nsoon we harvest our last crop.\nAll we have created we shall own,\nonce we had nothing, everything we shall receive.",
    funFacts: "The Internationale is a left-wing anthem that has been adopted by student movements worldwide. Swedish students often sing it at formal sitz dinners.",
  },
  {
    id: 5,
    title: "Fredmans Epistlar Nr. 48",
    lyrics: "Solen glimmar blank och trind,\nJordgloben liksom ett ruttet äpple.\nSå lät oss bruka väl vår tid\noch dricka mera päppel!",
    lyricsEn: "The sun gleams round and bright,\nThe globe like a rotten apple.\nSo let us use our time well\nand drink more cider!",
    funFacts: "Carl Michael Bellman (1740-1795) was a Swedish poet and songwriter. His Fredmans Epistlar is a collection of songs describing life in Stockholm's taverns.",
  },
  {
    id: 6,
    title: "O Gamla Klang",
    lyrics: "O gamla klang- och jubeltid,\nmin ungdoms glada dar!\nJag minns dig väl i lust och strid,\nsom allting lika var.\nOch jubel ljöd vid glasens klang,\noch fröjd med oss till kojs vi gång.",
    lyricsEn: "O old time of sound and jubilation,\nmy youth's happy days!\nI remember you well in joy and strife,\nwhen everything was equal.\nAnd cheers rang with clinking glasses,\nand joy with us to bed we'd go.",
    funFacts: "O Gamla Klang is a Swedish adaptation of 'Auld Lang Syne'. It is traditionally sung at the end of academic dinners and gatherings in Scandinavia.",
  },
  {
    id: 7,
    title: "Ölansen",
    lyrics: "Ölansen, ölansen,\nhej vad vi har det bansen!\nVi dricker och vi sjunger\noch alla glada lunger\nde kvittrar som en kvast!\nÖlansen, ölansen!",
    lyricsEn: "The beer song, the beer song,\nhey what fun we're having!\nWe drink and we sing\nand all happy lungs\nthey chirp like a broom!\nThe beer song, the beer song!",
    funFacts: "Ölansen is one of the simpler and most fun drinking songs, popular among Finnish-Swedish students at Hanken and other Swedish-speaking institutions in Finland.",
  },
  {
    id: 8,
    title: "Sjungom Studentens",
    lyrics: "Sjungom studentens lyckliga dag,\nlåtom oss fira vår glädje!\nFöga vi sörja, mycket vi le,\nvarje dag en ny fest vi se!",
    lyricsEn: "Let's sing of the student's happy day,\nlet us celebrate our joy!\nLittle we mourn, much we smile,\nevery day a new feast we see!",
    funFacts: "A beloved student celebration song sung across Nordic universities, particularly during spring festivals and graduation ceremonies.",
  },
  {
    id: 9,
    title: "Hankens Egen",
    lyrics: "Vi är från Hanken, stolta och fria,\nkunskap och gemenskap vår väg vi gå.\nMed sång och skratt vi dagarna prisa,\noch framtiden ljus framför oss stå!",
    lyricsEn: "We are from Hanken, proud and free,\nknowledge and community our path we take.\nWith song and laughter we praise the days,\nand the future bright before us stands!",
    funFacts: "Hankens Egen is an unofficial anthem celebrating Hanken School of Economics. It captures the spirit of community and academic pursuit that defines the Hanken experience.",
  },
  {
    id: 10,
    title: "Snapsvisa",
    lyrics: "En liten fågel satt och kvittrade i lunden,\nhan sjöng om bästa stunden.\nDen stunden den var god,\nnär snapsen göt sitt mod\ni kropp och själ i kvällens stund!",
    lyricsEn: "A little bird sat chirping in the grove,\nhe sang about the best moment.\nThat moment was good,\nwhen the snaps poured its courage\ninto body and soul in the evening hour!",
    funFacts: "Snapsvisor (snaps songs) are a cherished tradition in Swedish and Finnish-Swedish culture. They are short songs sung before drinking a shot of snaps at dinners and celebrations.",
  },
];
