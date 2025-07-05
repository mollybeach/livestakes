--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: livestreams; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.livestreams (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    creator_wallet_address text NOT NULL,
    stream_url text,
    thumbnail_url text,
    status text DEFAULT 'scheduled'::text NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    view_count integer DEFAULT 0,
    category text,
    tags jsonb DEFAULT '[]'::jsonb,
    transcript text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    market_ids jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT livestreams_status_check CHECK ((status = ANY (ARRAY['scheduled'::text, 'active'::text, 'ended'::text])))
);


ALTER TABLE public.livestreams OWNER TO root;

--
-- Name: livestreams_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.livestreams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.livestreams_id_seq OWNER TO root;

--
-- Name: livestreams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.livestreams_id_seq OWNED BY public.livestreams.id;


--
-- Name: market_metadata; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.market_metadata (
    id integer NOT NULL,
    contract_address text NOT NULL,
    creator_wallet_address text NOT NULL,
    description text,
    category text DEFAULT 'general'::text,
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.market_metadata OWNER TO root;

--
-- Name: market_metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.market_metadata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.market_metadata_id_seq OWNER TO root;

--
-- Name: market_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.market_metadata_id_seq OWNED BY public.market_metadata.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name text NOT NULL,
    applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO root;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO root;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: livestreams id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.livestreams ALTER COLUMN id SET DEFAULT nextval('public.livestreams_id_seq'::regclass);


--
-- Name: market_metadata id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.market_metadata ALTER COLUMN id SET DEFAULT nextval('public.market_metadata_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: livestreams; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.livestreams (id, title, description, creator_wallet_address, stream_url, thumbnail_url, status, start_time, end_time, view_count, category, tags, transcript, created_at, updated_at, market_ids) FROM stdin;
8	Revolutionizing Astrology with Blockchain: Munir's Mission	Munir is building a web 3.0 astrology app that holds astrologers accountable. Delve into his innovative idea and strategy for ETH Global!	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751717931835_9adb0fd1-ccba-483e-be8c-255b7628d44b.mp4	\N	ended	2025-07-05 12:19:11.23851+00	2025-07-05 12:19:11.23851+00	0	gaming	["ETH Global", "Astrology", "Blockchain", "Web 3.0", "Innovation"]	Hi, we're here with Munir. Munir, what are you hacking for ETH Global and what's the name of your project? I'm building an astrology app like Astro 3 app. You know like in today's world there are a lot of astrologers. First of all like I feel like astrology is a great thing but you know a lot of astrologers don't do like great predictions. They lie about a lot of things. So I'm bringing this into the web 3 so that I make them accountable and whatever the predictions they give I tokenize all those predictions and people can predict and stake money. They have to also put the money and if they fake it, if they say wrong things, they will lose money. If they say the right things, they will gain money. That is like the aim with this astrological app. Yeah, that's amazing. Any strategy for winning? Any certain prizes you're going after? Like the strategy is to like build a great product which is very useful for the community and I think that is what ETH Global likes and apart from that like I'm applying to like EVM bounties maybe sell for like one inch and all of those things yeah. Awesome, have a good luck. Thank you.\n	2025-07-05 12:19:11.23851+00	2025-07-05 12:19:11.23851+00	[1]
9	Building a Crypto Payment App: An Interview with Arturo	Join Arturo as he discusses his project on creating a mini-app for bill payments using crypto, and his strategy for ETH Global.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751717973878_7dd41148-c5d5-4f35-8a3c-8eac2eb96ffe.mp4	\N	ended	2025-07-05 12:19:52.657468+00	2025-07-05 12:19:52.657468+00	0	gaming	["cryptocurrency", "app development", "interview", "ETH Global", "bill payments"]	Arturo, what's the name of your project and what are you building? Hello, I'm Arturo. I'm going to build a payments mini-app with Warcoin, Warchain, and it's cheap to pay. What's it solving? It's solving real use cases for bill payments, like you can pay your bills with crypto directly, USD or other stablecoins. You can pay your electricity bill, internet bill, or another. That's awesome. And what's your strategy for winning ETH Global? That's a good question. Let me think. I think I'm going to do my best. I'm trying to do something that is useful for the users. Any certain prize pools that you want to go for? Just War probably. Awesome, Arturo. Have a good luck. Thank you.\n	2025-07-05 12:19:52.657468+00	2025-07-05 12:19:52.657468+00	[1]
10	Revolutionizing Recognition for On-chain Creators | ETH Global Hackathon	Join Juan P. as he unveils a game-changing reputation system for on-chain creators at the ETH Global Hackathon.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751718002892_02a4c0d6-65be-46f4-a830-f428d8c27e8d.mp4	\N	ended	2025-07-05 12:20:22.701928+00	2025-07-05 12:20:22.701928+00	0	gaming	["blockchain", "on-chain creators", "ETH Global Hackathon", "reputation system", "Talent Protocol"]	Juan P, what's your project and what does it do? Hey, we are doing the creator score. It's a whole reputation system for own-chain creators. And what's the problem that it's solving? So right now creators don't have the recognition they deserve. We are making a reputation system that is super accurate to give you a score, that of course they can flex and lock rewards. And the cool part is that it will be a whole primitive for the own-chain ecosystem. So any protocol can see who are the top creators, how much they are earning, if they are artists, designers. It will be amazing. That's awesome. What's your strategy for winning? I mean, I don't really care that much about winning. Just having a great time and shipping a product. It's important to win. It's an ETH Global Hackathon. Maybe do you have a strategy or some prizes that you want to go for? Yeah. I mean, the strategy is simple. I think own-chain creators are one of the trending topics right now this year. It's kind of the meta, like Coinbase is going all-in on them. We have a super robust system already at Talent Protocol. It will be super easy. We will have a great product, great UI, and it will work. And that's the most important thing. Alright. Well, good luck on your journey and we'll see you on the publishing. Thank you, man.\n	2025-07-05 12:20:22.701928+00	2025-07-05 12:20:22.701928+00	[1]
11	Nick's Winning Edge at UnCode Hackathon: Real World Asset Infra	Nick from UnCode unveils his breakthrough project at the Hackathon: a cross-jurisdiction, real world asset infrastructure using Veris. Tune in to discover his strategy for winning!	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751718166161_fa657ec4-5b13-41df-bc89-76eb17254f7b.mp4	\N	ended	2025-07-05 12:23:12.190323+00	2025-07-05 12:23:12.190323+00	0	gaming	["UnCode", "Hackathon", "ETH Global", "Veris", "Blockchain"]	So here's Nick from UnCode winning Hackathon, tell us what you're working on. I'm building on Veris this time and it will be a real world asset infra for everybody who can explore real asset data on chain. That's nice, and what problem is it solving in comparison to other projects? So we've realised that nowadays a lot of real world asset marketplaces are just off-chain data, so everybody just, and they're also like only one jurisdiction restricted. So basically we're allowing cross-jurisdiction data on chain and we'll be integrating Circle, their paymaster, to allow seamless UX transaction with like zero native token guest fee. You can pay everything with USDC. So it will be a really big breakthrough for not just institutions and for everybody as well. That's awesome. What's your strategy for winning the ETH Global Hackathon? Well, I guess I'll just try my best to make my app and hopefully I can bring real changes to the industry. Do you have any certain focus on any prizes? Yeah, like Circle sponsors and the Graph sponsors because all the metadata on chain will be used with these protocols. That's awesome. Well good luck Nick. We'll see you around.  Thank you.\n	2025-07-05 12:23:12.190323+00	2025-07-05 12:23:12.190323+00	[1]
12	Nick from UnCode Shakes Up Real Asset Market with Blockchain	Join Nick from UnCode as he talks about his groundbreaking blockchain project at the ETH Global Hackathon. Discover the future of real asset data!	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751718203618_9717252f-0630-4840-9edf-a1f5dd22f230.mp4	\N	ended	2025-07-05 12:23:50.669305+00	2025-07-05 12:23:50.669305+00	0	gaming	["Hackathon", "UnCode", "Blockchain", "RealAssetData", "ETHGlobal"]	So here's Nick from UnCode winning Hackathon, tell us what you're working on. I'm building on Veris this time and it will be a real world asset infra for everybody who can explore real asset data on chain. That's nice, and what problem is it solving in comparison to other projects? So we've realized that nowadays a lot of real world asset marketplaces are just off-chain data, so everybody just, and they're also like only one jurisdiction restricted. So basically we're allowing cross-jurisdiction data on chain and we'll be integrating Circle, their paymaster, to allow seamless UX transaction with like zero native token guest fee. You can pay everything with USDC. So it will be a really big breakthrough for not just institutions and for everybody as well. That's awesome. What's your strategy for winning the ETH Global Hackathon? Well, I guess I'll just try my best to make my app and hopefully I can bring real changes to the industry. Do you have any certain focus on any prizes? Yeah, like Circle sponsors and the Graph sponsors, because all the metadata on chain will be used with these protocols. That's awesome. Well, good luck Nick. We'll see you around. Thank you.\n	2025-07-05 12:23:50.669305+00	2025-07-05 12:23:50.669305+00	[1]
18	Hacker's Journey: Building Anime Prediction Market	Watch as pro hacker Ankit dives into the exciting world of anime prediction markets at a hackathon.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751719253467_d4cd62fa-5bb9-446b-bab3-7590944710cc.mp4	\N	ended	2025-07-05 12:41:19.024712+00	2025-07-05 12:41:19.024712+00	0	gaming	["hackathon", "technology", "anime", "prediction market", "coding"]	so this professional hacker is cleaning his keyboard and he's ready to win the hackathon. Ankit, what's your project and what are you solving? so what I'm building this time is like a prediction market so you have heard about like basic prediction markets they just bet and bet on some basic things like poly market and stuff but there's a new concept like if you guys are familiar with like one piece or other animes they go on like for years like 10 years 20 years and the characters have a development there's something good happens with the character something bad happens with the character and people like to speculate around this thing like let's say some character has some fight and let's say who will win this fight and how will the character perform so people like to speculate around this so why don't we bring this on chain and create a whole prediction market around this betting so I am creating a generic prediction market around this thing so people can create a market for any anime for any series that has been going for a long time and they can create a bet like let's say Luffy will win this fight he will he win this or will he not win this and people will try to bet on this. Ankit, you are speaking with very high confidence what's your strategy for winning? sorry? you are speaking with very high confidence what's your strategy for winning? I mean just build it on let's see no no no there are prizes there are people that will choose who will win so what's your strategy there must be a strategy there's no strategy I've been building I've been in like 70 global hackathons I have won six out of them so let's see how this one goes so this guy is a winner I think we have to bet more on him and also good luck on your project Ankit what's the name? Ankit, the name of the project I haven't decided on a name yet he doesn't care but he will win\n	2025-07-05 12:41:19.024712+00	2025-07-05 12:41:19.024712+00	[1]
13	Romario's Bold Vision: Privacy & Innovation at ETH Global	Join Romario, an ambitious innovator, as he shares his project idea for ETH Global, tackling privacy in the digital world.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751718424682_cd7039d6-f139-45d7-93a0-66daa83e5c8b.mp4	\N	ended	2025-07-05 12:27:42.95404+00	2025-07-05 12:27:42.95404+00	0	gaming	["ETH Global", "Innovation", "Technology", "Privacy", "Interview"]	So here we met Romario, he's reminding you of Messi at ETH Global. Romario, tell us what's your project idea and how are you planning to win? Yeah, so I do not have an exactly solid project idea, but I'm probably going to... You have to tell them with conviction. Okay, I'm making something with World, probably something that proves stuff using ZK. So yeah, so... What's the problem that you are solving? What's the solution? Problem that I'm solving is like, the main problem with today's world is privacy, right? Nobody in the Web2 world seems to respect the other netizens' privacy, which is a huge concern. And I really want to fix that and give everybody the solution to privacy. Okay, what's the solution? Yeah, that's something I have to think about, because in Prague we made a project that won the finalist in Prague. We made something called World Maps, which is like flightly, but with provable flights. So your flights are actually provable using email proofs of V-Layer. And Romario, do you have any strategy to win ETH Global? Any prizes you're aiming for? Strategy to win ETH Global is have a good UI and make a great pitch, I would say. Even if stuff does not work, just make sure your idea gets through with the judges. More conviction, like we need the conviction, you know? Yeah, so just make sure that whatever's on your mind is translated well towards the judges. And that's all that they're looking for. They're looking for good products and not projects. Perfect. Good luck, bro. Thank you. Have a good time.\n	2025-07-05 12:27:42.95404+00	2025-07-05 12:27:42.95404+00	[1]
14	Serial Hackathon Winner Reveals Next Big Project	Follow this two-time hackathon champion as he unveils his plan to revolutionize Android operating systems.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751718591522_663cfa84-b295-49a4-8cfd-2a00ee607990.mp4	\N	ended	2025-07-05 12:30:16.899196+00	2025-07-05 12:30:16.899196+00	0	gaming	["hackathon", "android", "operating system", "data privacy", "innovation"]	Fellow here is a serial hacker winning two hackathons already. What's your idea? And what are you planning on going for the prizes? So I'm planning to build an operating system based on Android so it will generally intercept all network traffic and It will block all telemetry and it will redo it with ZK And then it will deliver the data because data is very much important to many researchers and data scientists We can't block them, but we can prove that it is a human and doesn't really Disclose any personal data. That's my project For you seem like you have big big big confidence. What's the where is it coming from? And what's the idea for winning? What's this Rajji? so I Don't really focus on winning. I just had an idea so I will be building it So in terms of sponsors tracks, I don't know. I didn't choose anyone Okay, so in terms of ZK, I will choose self and to identify different devices I'm going to use ENS. So awesome. Well, good luck hero. Thank you\n	2025-07-05 12:30:16.899196+00	2025-07-05 12:30:16.899196+00	[1]
15	Building the Decentralized Letterbox: Saeed's Winning Strategy	Join Saeed, a serial hacker and a film enthusiast, as he shares his unique project and his strategy for winning the Taipei Hackathon.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751718745330_da439e57-0919-4897-a995-f29839f65646.mp4	\N	ended	2025-07-05 12:32:49.941195+00	2025-07-05 12:32:49.941195+00	0	gaming	["hackathon", "technology", "blockchain", "film reviews", "decentralization"]	Saeed is also a serial hacker and he won Taipei Hackathon. Saeed, what's your project and what's your strategy for winning? Okay, so since we are building for cons, what about building something about films? So there's something letterbox. All the cinephiles love letterbox, they love giving reviews. So how we make a protocol proof of films? So basically, you watch a film and it is recorded on-chain, along with it you can give your reviews there. So basically letterbox with some steroids and some decentralization attitude. So that is what I'm trying to build here. That sounds fun. You seem like you are ready and you have a lot of clarity on your idea. What's your strategy for winning? So, nothing much. I love films, so I just go with the flow. And here I'm in cons, so I just love the place. Come on, you can name two prizes or three maybe that you're aiming for. Maybe I'm trying to do something with ENS and World, so that would go well I guess. Awesome, you're going to do it. I feel the energy. Have a good luck. Have a good day.\n	2025-07-05 12:32:49.941195+00	2025-07-05 12:32:49.941195+00	[1]
16	Revolutionizing Group Interactions: Alberto's AI-Driven Telegram Bot	Alberto, a top hacker, unveils his new project - a Telegram bot that ranks group influence and allows for rewards. Join us in exploring the future of AI integration.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751718927175_942964ad-4baa-4f26-8097-db933e1de50a.mp4	\N	ended	2025-07-05 12:35:49.624849+00	2025-07-05 12:35:49.624849+00	0	gaming	["AI", "Telegram Bot", "Hackathon", "Group Engagement", "Community Building"]	So here's the number one hacker, Alberto, tell us about your project. This time I want to build a telegram bot, it's more like a Kytorn telegram. Use a telegram bot to automatically calculate their influence on their group, and ranking it, and the admin can add a reward on it, and they can base on their ranking to get their associated reward on it. That's nice, what's the best, like, why do you think you will win? I think currently it's like an Info5 plus AI agent stage, so I integrate the AI stake and also with Info5 to make everybody to engage into the community and also use AI agent as a judge, I think it will be the future. And what are the prizes that you are going for in the hackathon? I will go for like Oasis, Raffle, check, and also for Dell Protocol to verify my bot identity, and also prizes, like easy for users to interact with you. Alright, so good luck on your project Alberto, you can do it. Thank you.\n	2025-07-05 12:35:49.624849+00	2025-07-05 12:35:49.624849+00	[1]
17	Emerging AI Boss Game at ETH Global with Nishant	Join Nishant at ETH Global as he shares the development of an AI boss game and his strategy towards winning the Fluence Bounty.	0x1234...	https://storage.googleapis.com/livestakes-videos/videos/video_0x1234.._1751719054984_bb67463e-84ee-4fa9-96f2-dfa636325634.mp4	\N	ended	2025-07-05 12:37:55.225884+00	2025-07-05 12:37:55.225884+00	0	gaming	["ETH Global", "AI Boss Game", "Blockchain Gods", "Game Development", "Fluence Bounty"]	Here with Nishant at the ETH Global, what are you building? So I'm building a game wherein like you'll have an AI boss which would try to attack you and the boss would respond according to how you have taken decisions so far. So it's like an intelligent enemy that you would be competing against and right now I'm thinking of targeting the Fluence Bounty and then there's also OG and Bronin. So do you have a strategy for winning? Have you done something similar before? What's your plan? So I've been working on this game called Blockchain Gods and what I'm trying to build is something that would help grow the game. So I'm building something that would be useful later on as I grow my game. Awesome. Good luck on your project bro. Thanks. Have a good time. \n	2025-07-05 12:37:55.225884+00	2025-07-05 12:37:55.225884+00	[1]
\.


--
-- Data for Name: market_metadata; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.market_metadata (id, contract_address, creator_wallet_address, description, category, tags, created_at, updated_at) FROM stdin;
1	0x3624681E73fbAaFA093bba2F1Cd9B55381d6F77B	0x9Db49f4192CE801045fEC2a7E5F8d58A799cc952	Who will win the ethglobal ???	general	[]	2025-07-05 16:43:19.751944+00	2025-07-05 16:43:19.751944+00
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.migrations (id, name, applied_at) FROM stdin;
1	add_tags_and_transcript_columns	2025-07-05 11:54:40.079508+00
2	add_market_ids_column	2025-07-05 16:41:40.317931+00
3	create_market_metadata_table	2025-07-05 16:41:40.416616+00
\.


--
-- Name: livestreams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.livestreams_id_seq', 18, true);


--
-- Name: market_metadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.market_metadata_id_seq', 1, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.migrations_id_seq', 3, true);


--
-- Name: livestreams livestreams_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.livestreams
    ADD CONSTRAINT livestreams_pkey PRIMARY KEY (id);


--
-- Name: market_metadata market_metadata_contract_address_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.market_metadata
    ADD CONSTRAINT market_metadata_contract_address_key UNIQUE (contract_address);


--
-- Name: market_metadata market_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.market_metadata
    ADD CONSTRAINT market_metadata_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: idx_livestreams_creator; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_livestreams_creator ON public.livestreams USING btree (creator_wallet_address);


--
-- Name: idx_livestreams_market_ids; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_livestreams_market_ids ON public.livestreams USING gin (market_ids);


--
-- Name: idx_livestreams_start_time; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_livestreams_start_time ON public.livestreams USING btree (start_time DESC);


--
-- Name: idx_livestreams_status; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_livestreams_status ON public.livestreams USING btree (status);


--
-- Name: idx_livestreams_tags; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_livestreams_tags ON public.livestreams USING gin (tags);


--
-- Name: idx_market_metadata_category; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_market_metadata_category ON public.market_metadata USING btree (category);


--
-- Name: idx_market_metadata_creator; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_market_metadata_creator ON public.market_metadata USING btree (creator_wallet_address);


--
-- Name: idx_market_metadata_tags; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_market_metadata_tags ON public.market_metadata USING gin (tags);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: root
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

