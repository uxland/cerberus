﻿namespace Cerberus.Maintenance.Features.Features.TrainingReviews;

public record AnalysisFailure(string FilterId, AnalysisFailureType Type, FilterResultReview Review);