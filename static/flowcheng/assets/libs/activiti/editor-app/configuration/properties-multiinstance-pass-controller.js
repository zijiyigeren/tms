var KisBpmMultiInstancePassCtrl = [ '$scope', function($scope) {

    // if ($scope.property.value == undefined && $scope.property.value == null)
    // {
    //     $scope.property.value = 'None';
    // }

    $scope.multiInstancePassChanged = function() {
        //console.log("1");
        $scope.updatePropertyInModel($scope.property);
    };
}];