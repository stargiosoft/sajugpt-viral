create table ghost_tarot_results (
  id uuid default gen_random_uuid() primary key,
  card_name varchar not null,   
  front_image varchar not null,     
  july_title varchar not null,  
  july_message text not null,       
  july_summary text not null,  
  august_title varchar not null,    
  august_message text not null,     
  august_summary text not null,   
  solution_title varchar not null,    
  solution_message text not null,      
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);