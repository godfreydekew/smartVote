--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidates (
    id integer NOT NULL,
    name text NOT NULL,
    party text,
    "position" text NOT NULL,
    bio text,
    photo text,
    twitter text,
    website text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    election_id integer
);


ALTER TABLE public.candidates OWNER TO postgres;

--
-- Name: candidates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.candidates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidates_id_seq OWNER TO postgres;

--
-- Name: candidates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.candidates_id_seq OWNED BY public.candidates.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    election_id integer,
    user_id integer,
    parent_id integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    text text NOT NULL,
    likes integer DEFAULT 0,
    dislikes integer DEFAULT 0
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elections (
    id integer NOT NULL,
    title text,
    description text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    status text,
    image_url text,
    participants integer DEFAULT 0,
    total_votes integer DEFAULT 0,
    progress double precision DEFAULT 0,
    organization text,
    is_public boolean,
    access_control text,
    age_restriction integer[],
    regions text[],
    use_captcha boolean DEFAULT false,
    rules text[],
    is_draft boolean DEFAULT false,
    banner_image text,
    primary_color text,
    smart_contract_address text,
    owner_address text,
    revoked boolean DEFAULT false,
    revoked_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    owner_user_id integer
);


ALTER TABLE public.elections OWNER TO postgres;

--
-- Name: elections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.elections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.elections_id_seq OWNER TO postgres;

--
-- Name: elections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.elections_id_seq OWNED BY public.elections.id;


--
-- Name: eligible_voters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eligible_voters (
    id integer NOT NULL,
    election_id integer,
    user_identifier text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.eligible_voters OWNER TO postgres;

--
-- Name: eligible_voters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eligible_voters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eligible_voters_id_seq OWNER TO postgres;

--
-- Name: eligible_voters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eligible_voters_id_seq OWNED BY public.eligible_voters.id;


--
-- Name: forget_password; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forget_password (
    id integer NOT NULL,
    user_email text NOT NULL,
    reset_token text NOT NULL,
    expiry_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);


ALTER TABLE public.forget_password OWNER TO postgres;

--
-- Name: forget_password_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forget_password_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forget_password_id_seq OWNER TO postgres;

--
-- Name: forget_password_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forget_password_id_seq OWNED BY public.forget_password.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    isread boolean DEFAULT false,
    user_id integer,
    title text NOT NULL,
    type text NOT NULL,
    description text,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: user_created_elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_created_elections (
    user_id integer NOT NULL,
    election_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_created_elections OWNER TO postgres;

--
-- Name: user_participated_elections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_participated_elections (
    user_id integer NOT NULL,
    election_id integer NOT NULL,
    has_voted boolean DEFAULT false,
    vote_time timestamp without time zone
);


ALTER TABLE public.user_participated_elections OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name text NOT NULL,
    age integer,
    gender text,
    country_of_residence text,
    email text NOT NULL,
    password text,
    user_role text DEFAULT 'basic'::text,
    kyc_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    kyc_session_id character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: candidates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates ALTER COLUMN id SET DEFAULT nextval('public.candidates_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: elections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elections ALTER COLUMN id SET DEFAULT nextval('public.elections_id_seq'::regclass);


--
-- Name: eligible_voters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eligible_voters ALTER COLUMN id SET DEFAULT nextval('public.eligible_voters_id_seq'::regclass);


--
-- Name: forget_password id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forget_password ALTER COLUMN id SET DEFAULT nextval('public.forget_password_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.candidates (id, name, party, "position", bio, photo, twitter, website, created_at, updated_at, election_id) FROM stdin;
1	Alex Johnson	MDC	President	Alex is a third-year political science major passionate about improving campus facilities and creating inclusive student spaces. Previous experience includes serving as class representative and organizing community outreach programs.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749049134/yj1lbtzryu8tzb2g5hwt.png			2025-06-04 18:00:37.139136	\N	1
7	Alex Johnsons	Party A	EU membership 	Experienced leader with a track record of bringing positive change to the community.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749276640/hvmtv7nmv5fsstexlvcl.png	x.com		2025-06-07 09:23:07.132943	\N	4
8	Sarah Williams	Part A	Eu membership	Advocate for transparent governance and effective communication with constituents	https://res.cloudinary.com/dki1hiyny/image/upload/v1749276841/zuzds1nci09uz1iycbyh.png	x.com		2025-06-07 09:23:07.132943	\N	4
9	Michael Gen	Party A	Eu membership	Technology professional focused on bringing innovation to government services.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749277004/a8bsitehvwrhc5zuq7ah.png	x.com		2025-06-07 09:23:07.132943	\N	4
10	Jessica Brown	Party A 	Eu membership	Community advocate with deep roots in the area and commitment to local issues.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749277033/kgc9l1ik6roo3yv85zj0.png	x.com		2025-06-07 09:23:07.132943	\N	4
15	John Smithy	Democratic	President	Current Vice President with 30 years of public service	https://res.cloudinary.com/dki1hiyny/image/upload/v1749287708/lxnbqx5uke2b3dmfck9m.png	x.com	https://repause.framer.website/	2025-06-07 12:30:05.220438	\N	6
16	Sarah Johnsonx	Republican	President 	Former Governor with focus on economic reform	https://res.cloudinary.com/dki1hiyny/image/upload/v1749287797/eei8duxuw7zwom0kf8oo.png	x.com	https://repause.framer.website/	2025-06-07 12:30:05.220438	\N	6
17	Alex Chenf	Independent	President 	Tech entrepreneur advocating for digital rights"	https://res.cloudinary.com/dki1hiyny/image/upload/v1749287849/qapdemc7fmbjpgdfbrme.png	X.com		2025-06-07 12:30:05.220438	\N	6
18	Tapiwa Chipenzi	MDC	President	State Attorney General with focus on consumer protection	https://res.cloudinary.com/dki1hiyny/image/upload/v1749288500/artsmfouxddm7sx3xahp.png			2025-06-07 12:30:05.220438	\N	6
55	James Wilison 	Democratic 	Senate	Incumbent Representative since 2016	https://res.cloudinary.com/dki1hiyny/image/upload/v1749288882/bucnsa6nlntlrexta0bx.png	x.com		2025-06-07 12:51:25.886711	\N	19
56	Lisa parkx	Republican	Senate	Local mayor and education advocate	https://res.cloudinary.com/dki1hiyny/image/upload/v1749288945/dqfiwh7fyrsuxuvdlvw5.png	x.com		2025-06-07 12:51:25.886711	\N	19
57	Alfred Netfaek	Independent	Senate	Lecturer at the university of California for 20 years. Has contributed to massive donations 	https://res.cloudinary.com/dki1hiyny/image/upload/v1749289014/owbgpn7fbmy7g7qvzpy0.png			2025-06-07 12:51:25.886711	\N	19
58	Dr. Michael Reynolds	Republican	House of Representatives	Incumbent since 2018 | Former public defender | Chair of Veterans Affairs Subcommittee	https://res.cloudinary.com/dki1hiyny/image/upload/v1749290245/t28bic8ke9cmonxt7zx4.png	x.com		2025-06-07 13:02:41.724995	\N	20
59	Rep. Jessica Morales	Democratic	House of Representatives	Cardiologist | Hospital administrator | First-time candidate	https://res.cloudinary.com/dki1hiyny/image/upload/v1749290364/b46wclcxev8wh7t6rcq5.png			2025-06-07 13:02:41.724995	\N	20
60	Jamal Patel	Democratic	House of Representatives	Tech entrepreneur | Renewable energy startup founder	https://res.cloudinary.com/dki1hiyny/image/upload/v1749290445/kcqdqfpim6abjxbn68ag.png			2025-06-07 13:02:41.724995	\N	20
61	Elon Musk	Democratic	House of Representatives	Incumbent since 2018 | Former public defender | Chair of Veterans Affairs Subcommittee	https://res.cloudinary.com/dki1hiyny/image/upload/v1749290491/zot3s6qlrdrouhtzuzdq.png			2025-06-07 13:02:41.724995	\N	20
62	Tendai Mukamuri	Zanu Pf	President	Dr. Tendai Mukamuri served as Minister of Finance from 2020-2025 and has been instrumental in Zimbabwe's economic stabilization efforts. He holds a PhD in Economics from the University of Zimbabwe and has worked extensively on monetary policy reform.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749296619/okfgbtp0hr8yfu1jz65a.png	@TendaiMukamuri		2025-06-07 14:47:51.977666	\N	21
63	Grace Nyadzayo	ZanuPf	President	Advocate Grace Nyadzayo is a renowned human rights lawyer who served as Mayor of Harare from 2018-2023. She has been at the forefront of democratic reform movements and women's rights advocacy in Zimbabwe.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749296654/kytfjpz8ls4oshdnuhbw.png			2025-06-07 14:47:51.977666	\N	21
64	Maxwell Sibanda	Citizens Coalition for Change	President 	Engineer Maxwell Sibanda is a successful business executive who led one of Zimbabwe's largest mining operations. At 43, he represents a new generation of leadership focused on innovation and youth empowerment.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749296721/iyvswhf63b5flt10j3gx.png			2025-06-07 14:47:51.977666	\N	21
65	Abdulah	Part A	President	Third-year Computer Science student. Focused on improving campus Wi-Fi and mental health resources.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749474113/axyiclx3dudbscxyk2az.png			2025-06-09 16:03:10.595434	\N	22
66	Davide Hoyo	Part B	President 	Second-year Political Science major. Advocates for sustainability and affordable meal plans	https://res.cloudinary.com/dki1hiyny/image/upload/v1749474122/awga4msfnnvrkfarqb2p.png			2025-06-09 16:03:10.595434	\N	22
67	Alex guni	Part A	President	Computer Science Senior - Focused on improving campus tech infrastructure	https://res.cloudinary.com/dki1hiyny/image/upload/v1749547159/ea63xx96morvm6hzvdja.png			2025-06-10 12:20:47.129448	\N	23
68	Rodrigoe	Part B	President	Political Science Junior - Advocating for student mental health services	https://res.cloudinary.com/dki1hiyny/image/upload/v1749547174/zztco8r5vu81siyugzqj.png			2025-06-10 12:20:47.129448	\N	23
69	Demir MUhammed	Voice of the People Party	Governor	A seasoned urban planner focused on sustainable infrastructure development, green spaces, and improving public transportation.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749554874/zqtccp6x46np8wqvk3kc.png			2025-06-10 14:30:30.224274	\N	24
70	Elif Kaya	Trust and Stability Party	Governor 	A long-serving civil servant with a background in public administration. Her campaign centers on enhancing public safety, improving social services, and ensuring stable economic policies that benefit all Istanbul residents.	\N			2025-06-10 14:30:30.224274	\N	24
71	 Dr. Kenan Ekinci	United Economy Movement	Minister	 A renowned economist and former central bank advisor, Dr. Ekinci advocates for fiscal discipline, reduced public spending, and investment in technology sectors to diversify the economy. He emphasizes controlling inflation and attracting foreign direct investment.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749555465/evhr5gjlr9tlyodyvglr.png			2025-06-10 14:41:15.754135	\N	25
72	Ms. Leyla Güneş	Social Welfare Party	Minister	A veteran of social policy and public administration, Ms. Güneş focuses on inclusive growth, progressive taxation, and strengthening social safety nets. Her platform includes increased funding for education and healthcare, aiming for more equitable wealth distribution.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749555543/cbphk9n1dla55rvsdtue.png			2025-06-10 14:41:15.754135	\N	25
73	 Mr. Alp Tekin	Progress and Development Alliance	Minister	A successful entrepreneur with a background in international finance, Mr. Tekin proposes tax incentives for small businesses, deregulation to boost market competition, and aggressive export promotion.	https://res.cloudinary.com/dki1hiyny/image/upload/v1749555623/nzsrwphhd96isp73zxu3.png			2025-06-10 14:41:15.754135	\N	25
74	Elif Yılmaz	Republican People's Party (CHP)	Leader	Experienced urban planner and former deputy mayor of Kadıköy. Focused on public transportation and green spaces.	https://res.cloudinary.com/dki1hiyny/image/upload/v1752238439/wk8bcsohny0ymvlkxvi8.png			2025-07-11 15:56:31.21024	\N	26
75	Murat Demir	Justice and Development Party (AKP)	Leader	Former city council member and business leader. Emphasizes infrastructure development and job creation.	https://res.cloudinary.com/dki1hiyny/image/upload/v1752238484/vl21dnboefbnr2spjc1f.png			2025-07-11 15:56:31.21024	\N	26
76	Selin Kaya	Good Party (İYİ Parti)	Leader	Social activist and education advocate. Campaigns for inclusive policies and digital transformation in public services.	https://res.cloudinary.com/dki1hiyny/image/upload/v1752238527/jdaqws0iqnr1yyjuquw1.png			2025-07-11 15:56:31.21024	\N	26
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, election_id, user_id, parent_id, "timestamp", text, likes, dislikes) FROM stdin;
\.


--
-- Data for Name: elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.elections (id, title, description, start_date, end_date, status, image_url, participants, total_votes, progress, organization, is_public, access_control, age_restriction, regions, use_captcha, rules, is_draft, banner_image, primary_color, smart_contract_address, owner_address, revoked, revoked_at, created_at, updated_at, owner_user_id) FROM stdin;
21	Zimababwe National Elections	Presidential election to elect the President of Zimbabwe for a 5-year term from 2028-2033.	2025-06-07 11:50:50.915	2025-06-14 11:39:50.915	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749296866/pqdptfouthylpjnxvvfi.png	0	1	0	government	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-07 14:47:51.419068	\N	\N
1	Student Council Election 2025	Annual election for the student council representatives	2025-06-04 15:03:38.959	2025-06-11 15:56:38.959	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749049231/pnchm6bkvoftwr1wmxfo.png	0	2	0	org2	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-04 18:00:36.807454	\N	\N
4	European Parliament Elections	Elections for Members of European Parliament	2025-06-07 06:24:50.863	2025-06-07 07:00:00	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749277115/h3sjsdezfwjt45fgqjfi.png	0	1	0	org2	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-07 09:23:06.780385	\N	\N
6	U.S. Presidential Election 2024	Elect the 47th President and Vice President of the United States. This election will determine the leadership for the 2025-2029 term.	2025-06-07 09:31:23.067	2025-06-07 09:53:00	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749288531/rhebails1yyapysoqkyn.png	0	1	0	org3	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends","Must be U.S. citizen"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-07 12:30:04.873451	\N	\N
19	U.S. Senate Election - California	This Senate election will fill California's Class 1 Senate seat for a six-year term (2025-2031).\n        The election comes at a critical time for California as it addresses wildfires, drought, and technology regulation.\n        The winner will join California's other Senator in representing the nation's most populous state.	2025-06-07 11:33:07.411	2025-06-07 17:00:00	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749289108/szuyhtzvcjx7rfxjs7s4.png	0	0	0	org2	f	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-07 12:51:24.722292	\N	\N
20	House of Representatives - District 45"	The 2022 election for Colorado's 45th congressional district was one of the most competitive House races in the nation,\n    with redistricting creating a true swing district. The election focused on healthcare reform, renewable energy investments,\n    and military veterans' benefits (due to the district's large veteran population). Voter turnout reached record levels.	2025-06-07 10:04:20.755	2025-06-14 09:54:20.755	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749290557/u8iv7mxnqz0urbnceb49.png	0	2	0	org2	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-07 13:02:41.393344	\N	\N
22	2025 Student Union Presidential Election	Vote for the next president of the Student Union at European University Of Lefke.	2025-06-09 13:05:32.154	2025-06-16 12:58:32.154	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749474186/nwbqmjze031l9i73i0tx.png	0	1	0	Government/Public Sector	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-09 16:03:10.269659	\N	\N
23	2024 Student Council Election	Vote for your next Student Council President at XYZ University	2025-06-10 09:22:39.459	2025-06-17 09:17:39.459	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749547229/dfy2jvidkkmp6cnojfju.png	0	0	0	Educational Institution	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-10 12:20:46.424298	\N	\N
24	Istanbul Metropolitan Governor Election	This election is for the Governor of Istanbul Metropolitan City, a pivotal role responsible for overseeing the administration, public services, and strategic development of Turkey's largest and most dynamic city.	2025-06-10 11:33:47.638	2025-06-17 11:25:47.638	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749555024/gqbz2rcfvugjc5xmdkod.png	0	0	0	Government/Public Sector	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-10 14:30:29.524763	\N	6
25	 National Finance Minister Election 2025	This election is to select the nation's next Minister of Finance, a crucial role responsible for guiding the country's economic policy, managing national budgets, and overseeing fiscal stability.	2025-06-10 11:42:21.472	2025-06-17 11:32:21.472	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1749555660/rprwenqiupjfu3gepvjv.png	0	1	0	Government/Public Sector	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-06-10 14:41:14.950807	\N	6
26	2025 Local Municipality Elections – Istanbul	2025 Local Municipality Elections – Istanbul	2025-07-11 12:58:36.604	2025-07-18 12:52:36.604	active	https://res.cloudinary.com/dki1hiyny/image/upload/v1752238583/drrsb75nd38mf20gfzts.png	0	1	0	Government/Public Sector	t	public	\N	\N	f	{"Each voter can vote only once","Voting is anonymous","Results will be published after election ends"}	t	\N	\N	\N	ASDASDASDAS	f	\N	2025-07-11 15:56:30.71994	\N	6
\.


--
-- Data for Name: eligible_voters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eligible_voters (id, election_id, user_identifier, created_at) FROM stdin;
\.


--
-- Data for Name: forget_password; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forget_password (id, user_email, reset_token, expiry_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, isread, user_id, title, type, description, "time") FROM stdin;
\.


--
-- Data for Name: user_created_elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_created_elections (user_id, election_id, created_at) FROM stdin;
\.


--
-- Data for Name: user_participated_elections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_participated_elections (user_id, election_id, has_voted, vote_time) FROM stdin;
6	25	f	2025-06-10 15:28:53.217406
6	26	t	2025-07-11 16:00:24.959627
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, age, gender, country_of_residence, email, password, user_role, kyc_verified, created_at, updated_at, kyc_session_id) FROM stdin;
6	Godfrey Dekera	25	male	other	dekewgodfrey@gmail.com	$2b$10$wpShlsAGO16e61rQKNSi2OctsQWLMgQiUdfmJfhkYiatLCRSQofA2	admin	f	2025-06-10 13:16:22.088684	\N	51e3ce29-0e3e-4a68-957d-0e29b79a2fa4
8	Godfrey	25	male	other	dekewgodfrey@icloud.com	$2b$10$JleCv8RHkZeR/UEb6liOFO6IEa3Ha9fSzYXbce7vmp9Q6HtVM9JxG	basic	f	2025-06-10 15:19:55.24669	\N	\N
\.


--
-- Name: candidates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.candidates_id_seq', 76, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- Name: elections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.elections_id_seq', 26, true);


--
-- Name: eligible_voters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eligible_voters_id_seq', 1, false);


--
-- Name: forget_password_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forget_password_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: candidates candidates_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_name_key UNIQUE (name);


--
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: elections elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elections
    ADD CONSTRAINT elections_pkey PRIMARY KEY (id);


--
-- Name: elections elections_smart_contract_address_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elections
    ADD CONSTRAINT elections_smart_contract_address_key UNIQUE (smart_contract_address);


--
-- Name: eligible_voters eligible_voters_election_id_user_identifier_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eligible_voters
    ADD CONSTRAINT eligible_voters_election_id_user_identifier_key UNIQUE (election_id, user_identifier);


--
-- Name: eligible_voters eligible_voters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eligible_voters
    ADD CONSTRAINT eligible_voters_pkey PRIMARY KEY (id);


--
-- Name: forget_password forget_password_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forget_password
    ADD CONSTRAINT forget_password_pkey PRIMARY KEY (id);


--
-- Name: forget_password forget_password_reset_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forget_password
    ADD CONSTRAINT forget_password_reset_token_key UNIQUE (reset_token);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: user_created_elections user_created_elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_created_elections
    ADD CONSTRAINT user_created_elections_pkey PRIMARY KEY (user_id, election_id);


--
-- Name: user_participated_elections user_participated_elections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_participated_elections
    ADD CONSTRAINT user_participated_elections_pkey PRIMARY KEY (user_id, election_id);


--
-- Name: users users_email_full_name_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_full_name_id_key UNIQUE (email, full_name, id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: candidates candidates_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE;


--
-- Name: comments comments_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE;


--
-- Name: comments comments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON DELETE SET NULL;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: elections elections_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elections
    ADD CONSTRAINT elections_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: eligible_voters eligible_voters_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eligible_voters
    ADD CONSTRAINT eligible_voters_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_created_elections user_created_elections_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_created_elections
    ADD CONSTRAINT user_created_elections_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE;


--
-- Name: user_created_elections user_created_elections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_created_elections
    ADD CONSTRAINT user_created_elections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_participated_elections user_participated_elections_election_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_participated_elections
    ADD CONSTRAINT user_participated_elections_election_id_fkey FOREIGN KEY (election_id) REFERENCES public.elections(id) ON DELETE CASCADE;


--
-- Name: user_participated_elections user_participated_elections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_participated_elections
    ADD CONSTRAINT user_participated_elections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

