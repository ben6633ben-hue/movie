import { Movie } from "@/types/movie";

const placeholderImage = "/cat.jpeg";

export const featuredMovies: Movie[] = [
  { id: 1, title: "Taxi Driver (Mobeomtaeksi)", image: placeholderImage, genre: "Action", rating: 8.1, year: 2021, episodes: 4, isHD: false },
  { id: 2, title: "Predator: Badlands", image: placeholderImage, genre: "Sci-Fi", rating: 7.5, year: 2025, duration: "01:47", isHD: true },
  { id: 3, title: "The Manipulated", image: placeholderImage, genre: "Thriller", rating: 9.4, year: 2025, episodes: 10, isHD: false },
  { id: 4, title: "Dear X", image: placeholderImage, genre: "Drama", rating: 9.1, year: 2025, episodes: 1, isHD: false },
  { id: 5, title: "Stranger Things", image: placeholderImage, genre: "Sci-Fi", rating: 8.6, year: 2016, episodes: 4, isHD: false },
  { id: 6, title: "Troll 2", image: placeholderImage, genre: "Fantasy", rating: 5.5, year: 2025, duration: "01:45", isHD: true },
  { id: 7, title: "Tron: Ares", image: placeholderImage, genre: "Sci-Fi", rating: 6.5, year: 2025, duration: "02:00", isHD: true },
  { id: 8, title: "UDT: Heroes Next Door", image: placeholderImage, genre: "Action", rating: 9.4, year: 2025, episodes: 6, isHD: false },
  { id: 9, title: "It: Welcome to Derry", image: placeholderImage, genre: "Horror", rating: 7.9, year: 2025, episodes: 6, isHD: false },
  { id: 10, title: "Detective Conan: One-Eyed...", image: placeholderImage, genre: "Animation", rating: 6.8, year: 2025, duration: "01:49", isHD: true },
  { id: 11, title: "Dynamite Kiss", image: placeholderImage, genre: "Romance", rating: 7.3, year: 2025, episodes: 6, isHD: false },
  { id: 12, title: "Inception", image: placeholderImage, genre: "Sci-Fi", rating: 8.8, year: 2010, duration: "02:28", isHD: true },
  { id: 13, title: "The Dark Knight", image: placeholderImage, genre: "Action", rating: 9.0, year: 2008, duration: "02:32", isHD: true },
  { id: 14, title: "Parasite", image: placeholderImage, genre: "Thriller", rating: 8.5, year: 2019, duration: "02:12", isHD: true },
  { id: 15, title: "Interstellar", image: placeholderImage, genre: "Sci-Fi", rating: 8.7, year: 2014, duration: "02:49", isHD: true },
];

export const latestMovies: Movie[] = [
  { id: 31, title: "Matt Rife: Unwrapped", image: placeholderImage, genre: "Comedy", rating: 6.8, year: 2025, duration: "00:59", isHD: true },
  { id: 32, title: "Diabolisch", image: placeholderImage, genre: "Horror", rating: 7.4, year: 2025, duration: "01:35", isHD: true },
  { id: 33, title: "Thamma", image: placeholderImage, genre: "Comedy, Horror", rating: 6.4, year: 2025, duration: "02:28", isHD: true },
  { id: 34, title: "Tom and Jerry: Forbidden", image: placeholderImage, genre: "Animation", rating: 3.9, year: 2025, duration: "01:44", isHD: true },
  { id: 35, title: "Detective Conan", image: placeholderImage, genre: "Animation", rating: 6.8, year: 2025, duration: "01:49", isHD: true },
  { id: 36, title: "Gajaana", image: placeholderImage, genre: "Fantasy", rating: 3.8, year: 2025, duration: "01:43", isHD: true },
  { id: 37, title: "The Pet Detective", image: placeholderImage, genre: "Comedy", rating: 7.5, year: 2025, duration: "01:53", isHD: true },
  { id: 38, title: "Trap House", image: placeholderImage, genre: "Action", rating: 5.9, year: 2025, duration: "01:42", isHD: true },
  { id: 39, title: "Lookout", image: placeholderImage, genre: "Thriller", rating: 4.0, year: 2025, duration: "01:20", isHD: true },
  { id: 40, title: "Troll 2", image: placeholderImage, genre: "Action", rating: 5.5, year: 2025, duration: "01:45", isHD: true },
];

export const seriesMovies: Movie[] = [
  { id: 51, title: "The Manipulated", image: placeholderImage, genre: "Thriller", rating: 8.1, year: 2025, episodes: 10, isHD: false },
  { id: 52, title: "Dear X", image: placeholderImage, genre: "Drama", rating: 9.4, year: 2025, episodes: 10, isHD: false },
  { id: 53, title: "Stranger Things S5", image: placeholderImage, genre: "Sci-Fi", rating: 9.1, year: 2025, episodes: 10, isHD: false },
  { id: 54, title: "The Last of Us", image: placeholderImage, genre: "Drama", rating: 8.6, year: 2024, episodes: 4, isHD: false },
  { id: 55, title: "It: Welcome to Derry", image: placeholderImage, genre: "Horror", rating: 9.4, year: 2025, episodes: 6, isHD: false },
  { id: 56, title: "Dynamite Kiss", image: placeholderImage, genre: "Romance", rating: 7.9, year: 2025, episodes: 6, isHD: false },
  { id: 57, title: "Squid Game S2", image: placeholderImage, genre: "Thriller", rating: 7.3, year: 2024, episodes: 6, isHD: false },
  { id: 58, title: "Spirit Fingers", image: placeholderImage, genre: "Romance", rating: 8.9, year: 2025, episodes: 12, isHD: false },
  { id: 59, title: "House of Dragon S2", image: placeholderImage, genre: "Fantasy", rating: 8.9, year: 2024, episodes: 16, isHD: false },
  { id: 60, title: "Wednesday S2", image: placeholderImage, genre: "Comedy", rating: 8.2, year: 2025, episodes: 8, isHD: false },
];

export const seriesUpdate: Movie[] = [
  { id: 61, title: "Lovely Runner", image: placeholderImage, genre: "Romance", rating: 9.2, year: 2024, episodes: 16, isHD: false },
  { id: 62, title: "Queen of Tears", image: placeholderImage, genre: "Drama", rating: 8.8, year: 2024, episodes: 16, isHD: false },
  { id: 63, title: "Marry My Husband", image: placeholderImage, genre: "Romance", rating: 8.5, year: 2024, episodes: 16, isHD: false },
  { id: 64, title: "The Glory S2", image: placeholderImage, genre: "Thriller", rating: 8.9, year: 2023, episodes: 8, isHD: false },
  { id: 65, title: "Alchemy of Souls S2", image: placeholderImage, genre: "Fantasy", rating: 8.7, year: 2023, episodes: 10, isHD: false },
  { id: 66, title: "Business Proposal", image: placeholderImage, genre: "Romance", rating: 8.3, year: 2022, episodes: 12, isHD: false },
  { id: 67, title: "Twenty Five Twenty One", image: placeholderImage, genre: "Drama", rating: 8.6, year: 2022, episodes: 16, isHD: false },
  { id: 68, title: "All of Us Are Dead", image: placeholderImage, genre: "Horror", rating: 7.8, year: 2022, episodes: 12, isHD: false },
];

export const topBulanIni: Movie[] = [
  { id: 71, title: "Moana 2", image: placeholderImage, genre: "Animation", rating: 7.8, year: 2024, duration: "01:40", isHD: true },
  { id: 72, title: "Wicked", image: placeholderImage, genre: "Musical", rating: 8.1, year: 2024, duration: "02:40", isHD: true },
  { id: 73, title: "Gladiator II", image: placeholderImage, genre: "Action", rating: 7.5, year: 2024, duration: "02:28", isHD: true },
  { id: 74, title: "Red One", image: placeholderImage, genre: "Action", rating: 6.9, year: 2024, duration: "02:03", isHD: true },
  { id: 75, title: "Kraven the Hunter", image: placeholderImage, genre: "Action", rating: 5.8, year: 2024, duration: "02:07", isHD: true },
  { id: 76, title: "Mufasa: Lion King", image: placeholderImage, genre: "Animation", rating: 7.2, year: 2024, duration: "01:58", isHD: true },
  { id: 77, title: "Sonic 3", image: placeholderImage, genre: "Animation", rating: 7.6, year: 2024, duration: "01:50", isHD: true },
  { id: 78, title: "A Complete Unknown", image: placeholderImage, genre: "Biography", rating: 8.0, year: 2024, duration: "02:20", isHD: true },
];

export const rekomendasiUntukmu: Movie[] = [
  { id: 81, title: "Dune: Part Two", image: placeholderImage, genre: "Sci-Fi", rating: 8.8, year: 2024, duration: "02:46", isHD: true },
  { id: 82, title: "Civil War", image: placeholderImage, genre: "Action", rating: 7.4, year: 2024, duration: "01:49", isHD: true },
  { id: 83, title: "Furiosa", image: placeholderImage, genre: "Action", rating: 7.8, year: 2024, duration: "02:28", isHD: true },
  { id: 84, title: "The Fall Guy", image: placeholderImage, genre: "Action", rating: 7.3, year: 2024, duration: "02:06", isHD: true },
  { id: 85, title: "Kingdom of Planet of Apes", image: placeholderImage, genre: "Sci-Fi", rating: 7.2, year: 2024, duration: "02:25", isHD: true },
  { id: 86, title: "Godzilla x Kong", image: placeholderImage, genre: "Action", rating: 6.5, year: 2024, duration: "01:55", isHD: true },
  { id: 87, title: "Deadpool & Wolverine", image: placeholderImage, genre: "Action", rating: 8.0, year: 2024, duration: "02:08", isHD: true },
  { id: 88, title: "Inside Out 2", image: placeholderImage, genre: "Animation", rating: 8.2, year: 2024, duration: "01:36", isHD: true },
];

export const nontonBarengKeluarga: Movie[] = [
  { id: 91, title: "Despicable Me 4", image: placeholderImage, genre: "Animation", rating: 6.8, year: 2024, duration: "01:35", isHD: true },
  { id: 92, title: "Kung Fu Panda 4", image: placeholderImage, genre: "Animation", rating: 6.9, year: 2024, duration: "01:34", isHD: true },
  { id: 93, title: "Migration", image: placeholderImage, genre: "Animation", rating: 7.0, year: 2023, duration: "01:23", isHD: true },
  { id: 94, title: "Wish", image: placeholderImage, genre: "Animation", rating: 5.8, year: 2023, duration: "01:35", isHD: true },
  { id: 95, title: "Elemental", image: placeholderImage, genre: "Animation", rating: 7.0, year: 2023, duration: "01:41", isHD: true },
  { id: 96, title: "The Wild Robot", image: placeholderImage, genre: "Animation", rating: 8.4, year: 2024, duration: "01:42", isHD: true },
  { id: 97, title: "Trolls Band Together", image: placeholderImage, genre: "Animation", rating: 6.5, year: 2023, duration: "01:31", isHD: true },
  { id: 98, title: "Wonka", image: placeholderImage, genre: "Fantasy", rating: 7.2, year: 2023, duration: "01:56", isHD: true },
];

export const actionTerbaru: Movie[] = [
  { id: 101, title: "The Beekeeper", image: placeholderImage, genre: "Action", rating: 6.5, year: 2024, duration: "01:45", isHD: true },
  { id: 102, title: "Bad Boys: Ride or Die", image: placeholderImage, genre: "Action", rating: 6.8, year: 2024, duration: "01:55", isHD: true },
  { id: 103, title: "Rebel Moon Part 2", image: placeholderImage, genre: "Action", rating: 5.6, year: 2024, duration: "02:02", isHD: true },
  { id: 104, title: "The Ministry of War", image: placeholderImage, genre: "Action", rating: 6.2, year: 2024, duration: "01:48", isHD: true },
  { id: 105, title: "Road House", image: placeholderImage, genre: "Action", rating: 6.4, year: 2024, duration: "02:01", isHD: true },
  { id: 106, title: "Monkey Man", image: placeholderImage, genre: "Action", rating: 7.0, year: 2024, duration: "02:01", isHD: true },
  { id: 107, title: "The Killer", image: placeholderImage, genre: "Action", rating: 7.1, year: 2023, duration: "01:58", isHD: true },
  { id: 108, title: "Extraction 2", image: placeholderImage, genre: "Action", rating: 7.0, year: 2023, duration: "02:02", isHD: true },
];

export const maratonDrakor: Movie[] = [
  { id: 111, title: "Crash Landing on You", image: placeholderImage, genre: "Romance", rating: 8.7, year: 2020, episodes: 16, isHD: false },
  { id: 112, title: "Goblin", image: placeholderImage, genre: "Fantasy", rating: 8.7, year: 2016, episodes: 16, isHD: false },
  { id: 113, title: "Itaewon Class", image: placeholderImage, genre: "Drama", rating: 8.2, year: 2020, episodes: 16, isHD: false },
  { id: 114, title: "Vincenzo", image: placeholderImage, genre: "Action", rating: 8.5, year: 2021, episodes: 20, isHD: false },
  { id: 115, title: "Hospital Playlist", image: placeholderImage, genre: "Drama", rating: 9.1, year: 2020, episodes: 12, isHD: false },
  { id: 116, title: "Reply 1988", image: placeholderImage, genre: "Drama", rating: 9.2, year: 2015, episodes: 20, isHD: false },
  { id: 117, title: "My Love from the Star", image: placeholderImage, genre: "Romance", rating: 8.3, year: 2013, episodes: 21, isHD: false },
  { id: 118, title: "Sky Castle", image: placeholderImage, genre: "Drama", rating: 8.8, year: 2018, episodes: 20, isHD: false },
];

export const horrorTerbaru: Movie[] = [
  { id: 121, title: "Longlegs", image: placeholderImage, genre: "Horror", rating: 7.0, year: 2024, duration: "01:41", isHD: true },
  { id: 122, title: "A Quiet Place: Day One", image: placeholderImage, genre: "Horror", rating: 6.8, year: 2024, duration: "01:39", isHD: true },
  { id: 123, title: "Smile 2", image: placeholderImage, genre: "Horror", rating: 6.9, year: 2024, duration: "02:07", isHD: true },
  { id: 124, title: "The Substance", image: placeholderImage, genre: "Horror", rating: 7.5, year: 2024, duration: "02:20", isHD: true },
  { id: 125, title: "Alien: Romulus", image: placeholderImage, genre: "Horror", rating: 7.4, year: 2024, duration: "01:59", isHD: true },
  { id: 126, title: "Terrifier 3", image: placeholderImage, genre: "Horror", rating: 6.8, year: 2024, duration: "02:05", isHD: true },
  { id: 127, title: "Immaculate", image: placeholderImage, genre: "Horror", rating: 5.9, year: 2024, duration: "01:29", isHD: true },
  { id: 128, title: "Abigail", image: placeholderImage, genre: "Horror", rating: 6.8, year: 2024, duration: "01:49", isHD: true },
];

export const romanceTerbaru: Movie[] = [
  { id: 131, title: "Anyone But You", image: placeholderImage, genre: "Romance", rating: 6.3, year: 2023, duration: "01:43", isHD: true },
  { id: 132, title: "The Idea of You", image: placeholderImage, genre: "Romance", rating: 6.4, year: 2024, duration: "01:55", isHD: true },
  { id: 133, title: "Love at First Sight", image: placeholderImage, genre: "Romance", rating: 6.3, year: 2023, duration: "01:30", isHD: true },
  { id: 134, title: "A Family Affair", image: placeholderImage, genre: "Romance", rating: 5.5, year: 2024, duration: "01:54", isHD: true },
  { id: 135, title: "Irish Wish", image: placeholderImage, genre: "Romance", rating: 4.8, year: 2024, duration: "01:33", isHD: true },
  { id: 136, title: "Upgraded", image: placeholderImage, genre: "Romance", rating: 5.9, year: 2024, duration: "01:44", isHD: true },
  { id: 137, title: "The Perfect Find", image: placeholderImage, genre: "Romance", rating: 5.8, year: 2023, duration: "01:39", isHD: true },
  { id: 138, title: "One True Loves", image: placeholderImage, genre: "Romance", rating: 5.8, year: 2023, duration: "01:40", isHD: true },
];

export const comedyTerbaru: Movie[] = [
  { id: 141, title: "Hit Man", image: placeholderImage, genre: "Comedy", rating: 7.1, year: 2024, duration: "01:55", isHD: true },
  { id: 142, title: "Ghostbusters: Frozen Empire", image: placeholderImage, genre: "Comedy", rating: 6.2, year: 2024, duration: "01:55", isHD: true },
  { id: 143, title: "Argylle", image: placeholderImage, genre: "Comedy", rating: 5.9, year: 2024, duration: "02:19", isHD: true },
  { id: 144, title: "The Fall Guy", image: placeholderImage, genre: "Comedy", rating: 7.3, year: 2024, duration: "02:06", isHD: true },
  { id: 145, title: "Beverly Hills Cop 4", image: placeholderImage, genre: "Comedy", rating: 6.1, year: 2024, duration: "01:58", isHD: true },
  { id: 146, title: "Mean Girls", image: placeholderImage, genre: "Comedy", rating: 6.0, year: 2024, duration: "01:52", isHD: true },
  { id: 147, title: "Ricky Stanicky", image: placeholderImage, genre: "Comedy", rating: 5.8, year: 2024, duration: "01:53", isHD: true },
  { id: 148, title: "Fly Me to the Moon", image: placeholderImage, genre: "Comedy", rating: 6.6, year: 2024, duration: "02:12", isHD: true },
];

export const koreaTerbaru: Movie[] = [
  { id: 151, title: "Exhuma", image: placeholderImage, genre: "Horror", rating: 7.3, year: 2024, duration: "02:14", isHD: true },
  { id: 152, title: "12.12: The Day", image: placeholderImage, genre: "Drama", rating: 8.0, year: 2023, duration: "02:21", isHD: true },
  { id: 153, title: "Concrete Utopia", image: placeholderImage, genre: "Drama", rating: 7.3, year: 2023, duration: "02:10", isHD: true },
  { id: 154, title: "Smugglers", image: placeholderImage, genre: "Action", rating: 7.0, year: 2023, duration: "02:09", isHD: true },
  { id: 155, title: "The Moon", image: placeholderImage, genre: "Sci-Fi", rating: 6.4, year: 2023, duration: "02:09", isHD: true },
  { id: 156, title: "Noryang: Sea of Death", image: placeholderImage, genre: "Action", rating: 7.1, year: 2023, duration: "02:32", isHD: true },
  { id: 157, title: "Kill Boksoon", image: placeholderImage, genre: "Action", rating: 6.5, year: 2023, duration: "02:18", isHD: true },
  { id: 158, title: "A Killer Paradox", image: placeholderImage, genre: "Thriller", rating: 7.5, year: 2024, episodes: 8, isHD: false },
];

export const thailandTerbaru: Movie[] = [
  { id: 161, title: "How to Make Millions...", image: placeholderImage, genre: "Drama", rating: 7.8, year: 2023, duration: "02:15", isHD: true },
  { id: 162, title: "The Medium", image: placeholderImage, genre: "Horror", rating: 6.6, year: 2021, duration: "02:11", isHD: true },
  { id: 163, title: "Home for Rent", image: placeholderImage, genre: "Horror", rating: 5.8, year: 2023, duration: "01:57", isHD: true },
  { id: 164, title: "Deep", image: placeholderImage, genre: "Horror", rating: 5.6, year: 2021, duration: "01:48", isHD: true },
  { id: 165, title: "Pee Nak 3", image: placeholderImage, genre: "Comedy", rating: 5.5, year: 2022, duration: "01:48", isHD: true },
  { id: 166, title: "Low Season", image: placeholderImage, genre: "Drama", rating: 6.8, year: 2023, duration: "01:52", isHD: true },
  { id: 167, title: "4 Kings 2", image: placeholderImage, genre: "Action", rating: 6.2, year: 2023, duration: "02:05", isHD: true },
  { id: 168, title: "Faces of Anne", image: placeholderImage, genre: "Thriller", rating: 6.0, year: 2022, duration: "01:49", isHD: true },
];

export const indiaTerbaru: Movie[] = [
  { id: 171, title: "Kalki 2898 AD", image: placeholderImage, genre: "Sci-Fi", rating: 7.5, year: 2024, duration: "03:01", isHD: true },
  { id: 172, title: "Fighter", image: placeholderImage, genre: "Action", rating: 6.2, year: 2024, duration: "02:46", isHD: true },
  { id: 173, title: "Animal", image: placeholderImage, genre: "Action", rating: 6.4, year: 2023, duration: "03:21", isHD: true },
  { id: 174, title: "Salaar", image: placeholderImage, genre: "Action", rating: 6.8, year: 2023, duration: "02:55", isHD: true },
  { id: 175, title: "Dunki", image: placeholderImage, genre: "Drama", rating: 6.8, year: 2023, duration: "02:41", isHD: true },
  { id: 176, title: "Sam Bahadur", image: placeholderImage, genre: "Biography", rating: 8.0, year: 2023, duration: "02:38", isHD: true },
  { id: 177, title: "12th Fail", image: placeholderImage, genre: "Drama", rating: 9.0, year: 2023, duration: "02:27", isHD: true },
  { id: 178, title: "Jawan", image: placeholderImage, genre: "Action", rating: 7.2, year: 2023, duration: "02:49", isHD: true },
];

export const daftarLengkapFilmTerbaru: Movie[] = [
  { id: 181, title: "Nosferatu", image: placeholderImage, genre: "Horror", rating: 7.8, year: 2024, duration: "02:12", isHD: true },
  { id: 182, title: "The Brutalist", image: placeholderImage, genre: "Drama", rating: 8.2, year: 2024, duration: "03:35", isHD: true },
  { id: 183, title: "Maria", image: placeholderImage, genre: "Biography", rating: 7.0, year: 2024, duration: "02:03", isHD: true },
  { id: 184, title: "Conclave", image: placeholderImage, genre: "Thriller", rating: 7.8, year: 2024, duration: "02:00", isHD: true },
  { id: 185, title: "Anora", image: placeholderImage, genre: "Drama", rating: 7.9, year: 2024, duration: "02:19", isHD: true },
  { id: 186, title: "The Room Next Door", image: placeholderImage, genre: "Drama", rating: 7.5, year: 2024, duration: "01:47", isHD: true },
  { id: 187, title: "Emilia Pérez", image: placeholderImage, genre: "Musical", rating: 7.2, year: 2024, duration: "02:10", isHD: true },
  { id: 188, title: "September 5", image: placeholderImage, genre: "Drama", rating: 7.3, year: 2024, duration: "01:35", isHD: true },
  { id: 189, title: "Ozzy Osbourne: No Escape", image: placeholderImage, genre: "Documentary, Biography", rating: 8.4, year: 2025, duration: "02:03", isHD: true },
  { id: 190, title: "Being Eddie", image: placeholderImage, genre: "Documentary, Biography", rating: 7.0, year: 2025, duration: "01:43", isHD: true },
  { id: 191, title: "Run", image: placeholderImage, genre: "Thriller", rating: 8.0, year: 2025, duration: "01:37", isHD: true },
  { id: 192, title: "Guru Nanak Jahaz", image: placeholderImage, genre: "History", rating: 8.9, year: 2025, duration: "02:20", isHD: true },
  { id: 193, title: "One of One", image: placeholderImage, genre: "Documentary", rating: 7.4, year: 2025, duration: "01:22", isHD: true },
  { id: 194, title: "The Fostered", image: placeholderImage, genre: "Thriller", rating: 5.9, year: 2025, duration: "01:17", isHD: true },
  { id: 195, title: "Knight Life", image: placeholderImage, genre: "Documentary", rating: 7.8, year: 2025, duration: "01:28", isHD: true },
  { id: 196, title: "Now You See Me: Now You", image: placeholderImage, genre: "Crime, Thriller", rating: 6.2, year: 2025, duration: "01:44", isHD: true },
  { id: 197, title: "Come See Me in the Good Light", image: placeholderImage, genre: "Documentary, Biography", rating: 7.9, year: 2025, duration: "01:45", isHD: true },
  { id: 198, title: "Ek Chatur Naar", image: placeholderImage, genre: "Comedy", rating: 7.3, year: 2026, duration: "02:11", isHD: true },
  { id: 199, title: "The Beldham", image: placeholderImage, genre: "Horror", rating: 5.4, year: 2025, duration: "01:25", isHD: true },
  { id: 200, title: "Idaho Fallen", image: placeholderImage, genre: "Crime, Drama", rating: 7.1, year: 2025, duration: "01:44", isHD: true },
  { id: 201, title: "The Old Woman with the Knife", image: placeholderImage, genre: "Action, Crime", rating: 6.0, year: 2025, duration: "02:06", isHD: true },
  { id: 202, title: "Tee Yai Rerk Dao Jone", image: placeholderImage, genre: "Drama", rating: 5.6, year: 2025, duration: "01:58", isHD: true },
  { id: 203, title: "Playdate", image: placeholderImage, genre: "Action, Comedy", rating: 5.6, year: 2025, duration: "01:35", isHD: true },
  { id: 204, title: "Deathstalker", image: placeholderImage, genre: "Action, Adventure", rating: 6.1, year: 2025, duration: "01:43", isHD: true },
  { id: 205, title: "Don't Let's Go to the Dogs Tonight", image: placeholderImage, genre: "Drama, War", rating: 6.9, year: 2025, duration: "01:39", isHD: true },
  { id: 206, title: "A Merry Little Ex-Mas", image: placeholderImage, genre: "Romance, Comedy", rating: 5.6, year: 2025, duration: "01:31", isHD: true },
  { id: 207, title: "Roofman", image: placeholderImage, genre: "Biography, Crime", rating: 7.2, year: 2025, duration: "02:06", isHD: true },
  { id: 208, title: "Joy to the World", image: placeholderImage, genre: "Romance", rating: 5.7, year: 2025, duration: "01:27", isHD: true },
  { id: 209, title: "Kill Tony: Kill or Be Killed", image: placeholderImage, genre: "Comedy, Talk-Show", rating: 4.5, year: 2025, duration: "02:12", isHD: true },
  { id: 210, title: "Kishkindhapuri", image: placeholderImage, genre: "Horror", rating: 7.1, year: 2025, duration: "02:00", isHD: true },
  { id: 211, title: "The Man with the Black Umbrella", image: placeholderImage, genre: "Horror", rating: 4.3, year: 2025, duration: "01:30", isHD: true },
  { id: 212, title: "Hep Yek: Loto", image: placeholderImage, genre: "Comedy", rating: 3.2, year: 2025, duration: "01:25", isHD: true },
  { id: 213, title: "Aarpar", image: placeholderImage, genre: "Romance", rating: 6.9, year: 2025, duration: "02:07", isHD: true },
  { id: 214, title: "Creation of the Gods II", image: placeholderImage, genre: "Action, Drama", rating: 6.2, year: 2025, duration: "02:25", isHD: true },
  { id: 215, title: "Stone Cold Fox", image: placeholderImage, genre: "Action, Thriller", rating: 5.3, year: 2025, duration: "01:26", isHD: true },
  { id: 216, title: "Mango", image: placeholderImage, genre: "Comedy, Drama", rating: 5.9, year: 2025, duration: "01:36", isHD: true },
  { id: 217, title: "Wicked: One Wonderful Night", image: placeholderImage, genre: "Music", rating: 9.0, year: 2025, duration: "01:24", isHD: true },
  { id: 218, title: "Love+War", image: placeholderImage, genre: "Documentary, Biography", rating: 7.4, year: 2025, duration: "01:36", isHD: true },
  { id: 219, title: "Good Fortune", image: placeholderImage, genre: "Action, Comedy", rating: 6.8, year: 2025, duration: "01:38", isHD: true },
  { id: 220, title: "Ghaati", image: placeholderImage, genre: "Action, Crime", rating: 4.2, year: 2025, duration: "02:35", isHD: true },
  { id: 221, title: "Groom & Two Brides", image: placeholderImage, genre: "Comedy, Romance", rating: 3.6, year: 2025, duration: "01:38", isHD: true },
  { id: 222, title: "Baramulla", image: placeholderImage, genre: "Horror", rating: 6.4, year: 2025, duration: "02:00", isHD: true },
  { id: 223, title: "Predator: Badlands", image: placeholderImage, genre: "Action, Adventure", rating: 7.5, year: 2025, duration: "01:47", isHD: true },
  { id: 224, title: "Frankenstein", image: placeholderImage, genre: "Drama, Fantasy", rating: 7.7, year: 2025, duration: "02:32", isHD: true },
];
