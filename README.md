## Overview

Sheesh is a collaborative platform where party-goers can contribute to a party playlist in real-time. Built with Next.js and Supabase, and deployed on Netlify, this application ensures a seamless and engaging experience for users to share their favorite tracks for any party or event.

## Problem Solved

Finding the right music for a party can often be challenging and may not cater to all guests' tastes. The Party Playlist Builder solves this by allowing party-goers to collaboratively curate a music playlist. This crowd-sourcing approach ensures that the playlist is diverse and enjoyable for everyone involved, enhancing the overall party experience. By leveraging real-time updates, everyone has a chance to contribute their favorite tracks, making the music selection process more democratic and fun.

## Music search

The website requires you to use share spotify song links to work (the track id is extracted from the link and used to fetch the metadata). If you don't use spotify, the site might confuse you. When we do the in-class demo, this will be showcased fully.

## Features

-   **User Authentication**: Secure login and registration functionality using Supabase Auth. You can only create a room if you're authenticated. Anyone can join a room.
-   **Live Playlist Collaboration**: Users can add their favorite songs to the collaborative playlist in real-time.
-   **Spotify Integration**: Connects with Spotify's API to search for and add music tracks.
-   **Responsive Design**: Fully responsive web interface, compatible with all devices.

## Technologies

-   **Next.js**: For server-side rendering and static generation.
-   **Supabase**: Used for backend services like authentication and real-time database.
-   **Spotify API**: To fetch song data and manage playlists.
-   **Tailwind CSS**: For styling and responsive design.
-   **Netlify**: Hosting and automated deployments.

## Netlify deployment link

https://project4-sheesh.netlify.app/

# Questions

What are the design principles of your site? (Color pallette, fonts, layout, etc.)

-   What is the purpose of your site? Why does it need to exist?
    -   The purpose of the site is to allow partygoers or carpoolers to share their favorite music and curate otherwise generic playlists. It doesn't need to exist but it certainly could help people avoid generic playlists that they don't enjoy all that much.
-   Does your site look good on multiple screen sizes
    -   Yes! The site is fully responsive!
-   What is the Netlify URL of your site
    -   https://project4-sheesh.netlify.app/
-   How does your site use state to keep track of user interaction?
    -   The site uses react hooks and supabase realtime to sync user interactions with the server and other users.
-   Does your site fetch data from
    -   an internal source?
        -   The site fetches data from supabase for the votes on songs and we also cache the song metadata in their as well to avoid excessive requests to the spotify api.
    -   a third party API?
        -   The site fetches metadata about song tracks using copied song links. The trackId is extracted and used to poll the spotify api for more information about the song.
-   Does your site persist data using a third-party tool or database
    -   Data is persisted using supabase postgres database.
