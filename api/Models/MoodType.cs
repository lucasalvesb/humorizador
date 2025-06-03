using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public enum MoodType
    {
        Depression = 1,
        Anxiety = 2,
        LackOfFocus = 3,
        Sadness = 4,
        Stress = 5,
        Loneliness = 6,
        Anger = 7,
        Fear = 8,
        Overwhelmed = 9,
        LowSelfEsteem = 10,
        Guilt = 11,           
        Hopelessness = 12     
    }
    public static class MoodTypeExtensions
    {
        public static string GetDisplayName(this MoodType moodType) => moodType switch
        {
            MoodType.Depression => "Depression",
            MoodType.Anxiety => "Anxiety",
            MoodType.LackOfFocus => "Lack of Focus",
            MoodType.Sadness => "Sadness",
            MoodType.Stress => "Stress",
            MoodType.Loneliness => "Loneliness",
            MoodType.Anger => "Anger",
            MoodType.Fear => "Fear",
            MoodType.Overwhelmed => "Overwhelmed",
            MoodType.LowSelfEsteem => "Low Self-Esteem",
            MoodType.Guilt => "Guilt",                    
            MoodType.Hopelessness => "Hopelessness",      
            _ => moodType.ToString()
        };
    }
}