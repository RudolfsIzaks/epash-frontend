import React, { useState, useEffect, useRef } from "react";
import NavLogo from "../components/navLogo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../index.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faForward, faBackward } from "@fortawesome/free-solid-svg-icons";

function PlatformSpotify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { parsedData } = location.state || {};

  const [audioIndex, setAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const fallbackAudio = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  ];

  useEffect(() => {
    if (parsedData && parsedData.audio) {
      console.log("Audio URLs:", parsedData.audio);
      parsedData.audio.forEach((url) => {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              console.log(`URL ${url} is accessible`);
            } else {
              console.error(`URL ${url} is not accessible`);
            }
          })
          .catch((error) => console.error(`Error accessing URL ${url}:`, error));
      });
    }
  }, [parsedData]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    audioRef.current.currentTime -= 10;
  };

  const handleSkipForward = () => {
    audioRef.current.currentTime += 10;
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const audioProgression = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(audioProgression);
    }
  };

  const handleNextAudio = () => {
    setAudioIndex((prevIndex) => (prevIndex + 1) % (parsedData?.audio?.length || fallbackAudio.length));
  };

  const handlePreviousAudio = () => {
    setAudioIndex((prevIndex) => (prevIndex - 1 + (parsedData?.audio?.length || fallbackAudio.length)) % (parsedData?.audio?.length || fallbackAudio.length));
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [audioIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);

      // Clean up event listener on component unmount
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error attempting to play audio:', error);
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  if (!parsedData) {
    return <div>Loading...</div>;
  }

  const audioSources = parsedData.audio && parsedData.audio.length > 0 ? parsedData.audio : fallbackAudio;

  return (
    <>
      <div className="flex w-full justify-between items-center py-5 px-48">
        <NavLogo />
        <div className="flex gap-3">
          <Link
            to="/dashboard/manage-campaigns"
            className="flex justify-center items-center bg-epash-green text-white rounded-md px-8 h-12 font-bold hover:scale-110 duration-100"
          >
            Go Back
          </Link>
        </div>
      </div>
      <hr />
      <div>
        <h1 className="text-center mt-20 text-5xl font-custom font-bold">Modify your Spotify ads</h1>
        <p className="text-center mb-20 mt-5 text-xl">Manage your audio ads for Spotify.</p>
        <div className="flex flex-col m-10 rounded-lg shadow-lg border border-stone-200 bg-white p-10">
          <h1 className="text-4xl font-custom">Spotify Ad {audioIndex + 1}:</h1>
          <div className="flex flex-col items-start mt-10 flex-grow shadow-xl rounded-md p-10 border border-stone-100">
            <div className="flex gap-5 items-end justify-start">
              <img src={parsedData.images[0]} className="w-36 h-36 rounded-md"/>
              <h1 className="font-custom font-bold mb-10 text-3xl">{parsedData.title}</h1>
            </div>
            <audio ref={audioRef} className="w-full bg-transparent appearance-none">
              <source src={audioSources[audioIndex]} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <div className="relative w-full bg-gray-200 h-2 mt-5 rounded-md">
              <div style={{ width: `${progress}%` }} className="absolute top-0 left-0 h-full rounded-md bg-epash-green" />
            </div>

            <div className="flex justify-start gap-5 mt-5">
              <button onClick={handlePlayPause} className="py-2 px-5 rounded-md text-stone-400 font-custom font-black">
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              <button onClick={handleRewind} className="py-2 px-5 rounded-md text-stone-400 font-custom font-black">
                <FontAwesomeIcon icon={faBackward} />
              </button>
              <button onClick={handleSkipForward} className="py-2 px-5 rounded-md text-stone-400 font-custom font-black">
                <FontAwesomeIcon icon={faForward} />
              </button>
              <button onClick={handlePreviousAudio} className="py-2 px-5 rounded-md text-stone-400 font-custom font-black">
                Previous
              </button>
              <button onClick={handleNextAudio} className="py-2 px-5 rounded-md text-stone-400 font-custom font-black">
                Next
              </button>
            </div>
          </div>
          <div>
            <button className="py-2 px-5 bg-epash-green rounded-md text-white font-custom font-black mt-10">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlatformSpotify;
